"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

export type SpeechStatus =
  | "idle"
  | "requesting"
  | "listening"
  | "error"
  | "blocked"
  | "unsupported";

type RecognitionAlternative = {
  readonly transcript: string;
  readonly confidence: number;
};

type RecognitionResult = {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: RecognitionAlternative;
};

type RecognitionResultList = {
  readonly length: number;
  readonly [index: number]: RecognitionResult;
};

type RecognitionEvent = Event & {
  readonly resultIndex: number;
  readonly results: RecognitionResultList;
};

type RecognitionErrorEvent = Event & {
  readonly error: string;
};

/**
 * The Web Speech API is still experimental, so TypeScript's DOM library only
 * ships the result types. These are the parts of the interface this hook uses.
 */
type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
};

type RecognitionConstructor = new () => Recognition;

const UNSUPPORTED_MESSAGE =
  "This browser can't listen to speech. Type a command instead.";
const START_FAILED_MESSAGE =
  "Voice input couldn't start. Try again, or type a command instead.";

function getRecognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null;

  const scope = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };

  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
}

function supportsSpeech() {
  return getRecognitionConstructor() !== null;
}

/** The installed browser support never changes, so there is nothing to observe. */
function subscribeToSupport() {
  return () => {
    // No-op: support is fixed for the lifetime of the page.
  };
}

function describeSpeechError(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access is blocked. Allow it in your browser settings, or type a command instead.";
    case "no-speech":
      return "I didn't hear anything. Try again, or type a command instead.";
    case "audio-capture":
      return "No microphone was found. Connect one, or type a command instead.";
    case "network":
      return "The speech service couldn't be reached. Check your connection, or type a command instead.";
    case "language-not-supported":
      return "This browser can't understand English speech. Type a command instead.";
    default:
      return "Voice input stopped unexpectedly. Try again, or type a command instead.";
  }
}

function isPermissionError(code: string) {
  return code === "not-allowed" || code === "service-not-allowed";
}

/**
 * Real microphone input through the browser's SpeechRecognition API.
 *
 * Nothing starts on mount: the component calls `start()` from a user action
 * (a tap), which is what browsers require before asking for the microphone.
 * Final transcripts are handed back through `onFinal` so the existing mock
 * confirm/answer flow can decide what to do with the words.
 */
export function useSpeechRecognition({
  onFinal,
  lang = "en-US",
}: {
  onFinal: (text: string) => void;
  lang?: string;
}) {
  const supported = useSyncExternalStore(
    subscribeToSupport,
    supportsSpeech,
    () => false,
  );

  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");

  const recognitionRef = useRef<Recognition | null>(null);
  const finalRef = useRef("");
  const errorRef = useRef<string | null>(null);
  const cancelledRef = useRef(false);
  const mountedRef = useRef(true);
  const onFinalRef = useRef(onFinal);

  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      if (!recognition) return;

      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;

      try {
        recognition.abort();
      } catch {
        // The recogniser was already stopped.
      }
    };
  }, []);

  const ensureRecognition = useCallback((): Recognition | null => {
    if (recognitionRef.current) return recognitionRef.current;

    const Recognition = getRecognitionConstructor();
    if (!Recognition) return null;

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (!mountedRef.current) return;
      setStatus("listening");
    };

    recognition.onresult = (event) => {
      if (!mountedRef.current || cancelledRef.current) return;

      let finalText = "";
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        finalRef.current = `${finalRef.current} ${finalText}`.trim();
        setTranscript(finalRef.current);
      }
      setInterim(interimText);
    };

    recognition.onerror = (event) => {
      if (!mountedRef.current || event.error === "aborted") return;

      errorRef.current = event.error;
      setInterim("");
      setError(describeSpeechError(event.error));
      setStatus(isPermissionError(event.error) ? "blocked" : "error");
    };

    recognition.onend = () => {
      if (!mountedRef.current) return;

      setInterim("");
      const text = finalRef.current.trim();
      const failed = errorRef.current;

      if (failed) {
        setStatus(isPermissionError(failed) ? "blocked" : "error");
        return;
      }

      setStatus("idle");

      if (!cancelledRef.current && text) {
        cancelledRef.current = true;
        onFinalRef.current(text);
      }
    };

    recognitionRef.current = recognition;
    return recognition;
  }, [lang]);

  const start = useCallback(() => {
    if (!supportsSpeech()) {
      setError(UNSUPPORTED_MESSAGE);
      setStatus("unsupported");
      return;
    }

    const recognition = ensureRecognition();
    if (!recognition) {
      setError(UNSUPPORTED_MESSAGE);
      setStatus("unsupported");
      return;
    }

    finalRef.current = "";
    errorRef.current = null;
    cancelledRef.current = false;
    setTranscript("");
    setInterim("");
    setError(null);
    setStatus("requesting");

    try {
      recognition.start();
    } catch (cause) {
      // start() throws when a session is already starting or listening.
      if (cause instanceof DOMException && cause.name === "InvalidStateError") {
        return;
      }
      setError(START_FAILED_MESSAGE);
      setStatus("error");
    }
  }, [ensureRecognition]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    try {
      recognition.stop();
    } catch {
      // Nothing was running, so return the screen to its resting state.
      cancelledRef.current = true;
      setInterim("");
      setStatus("idle");
    }
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    finalRef.current = "";
    errorRef.current = null;
    setTranscript("");
    setInterim("");
    setError(null);

    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.abort();
      } catch {
        // Nothing was running.
      }
    }

    setStatus("idle");
  }, []);

  return {
    supported,
    status: supported ? status : ("unsupported" as const),
    error: error ?? (supported ? null : UNSUPPORTED_MESSAGE),
    transcript,
    interim,
    start,
    stop,
    cancel,
  };
}
