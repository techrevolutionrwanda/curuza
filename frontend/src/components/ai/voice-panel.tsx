"use client";

import Link from "next/link";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  CheckIcon,
  KeyboardIcon,
  MicIcon,
  SpeakerIcon,
  UploadIcon,
} from "./icons";

const DEFAULT_TRANSCRIPT = "Add an expense of 15,000 francs for transport";
const SUGGESTIONS = [
  "Add 20 bags of cement",
  "Show yesterday's records",
  "This month's total",
  "Find a customer",
];

type Mode = "listening" | "confirm" | "answer";
type ConfirmKind = "expense" | "stock";

type ConfirmRow = {
  key: string;
  value: string;
  amount?: boolean;
  pill?: string;
};

type Confirm = {
  title: string;
  rows: ConfirmRow[];
};

const CONFIRMS: Record<ConfirmKind, Confirm> = {
  expense: {
    title: "Add this expense?",
    rows: [
      { key: "Amount", value: "RWF 15,000", amount: true },
      { key: "Category", value: "Transport" },
      { key: "Date", value: "Today, 11 Nov 2026" },
      { key: "Paid from", value: "Cash", pill: "You didn't say" },
    ],
  },
  stock: {
    title: "Add this stock in?",
    rows: [
      { key: "Item", value: "Cement 50 kg" },
      { key: "Quantity", value: "20 bags", amount: true },
      { key: "Supplier", value: "Ruhango Hardware", pill: "Check this" },
      { key: "Date", value: "Today, 11 Nov 2026" },
    ],
  },
};

type Answer = {
  caption: string;
  amount: string;
  rows: { label: string; value: string; width: number }[];
  note: string;
};

const ANSWERS: Record<"month" | "yesterday" | "customers", Answer> = {
  month: {
    caption: "Money received, 1–11 November 2026",
    amount: "RWF 2,480,000",
    rows: [
      { label: "Sales", value: "RWF 2,105,000", width: 85 },
      { label: "Customer payments on credit", value: "RWF 375,000", width: 15 },
    ],
    note: "From 46 records. Read-only question — nothing was changed.",
  },
  yesterday: {
    caption: "Money received, yesterday · 10 November 2026",
    amount: "RWF 184,000",
    rows: [
      { label: "Sales", value: "RWF 150,000", width: 82 },
      { label: "Customer payments on credit", value: "RWF 34,000", width: 18 },
    ],
    note: "From 12 records. Read-only question — nothing was changed.",
  },
  customers: {
    caption: "Customers with unpaid balances",
    amount: "RWF 375,000",
    rows: [
      { label: "3 customers with a balance", value: "RWF 375,000", width: 72 },
      { label: "Oldest unpaid invoice", value: "12 days", width: 28 },
    ],
    note: "Read-only question — nothing was changed.",
  },
};

function Transcript({ text }: { text: string }) {
  const match = text.match(/^(.*?)(transport\.?)$/i);
  if (!match) return <>{text}</>;
  return (
    <>
      {match[1]}
      <span>{match[2]}</span>
    </>
  );
}

export function VoicePanel() {
  const [mode, setMode] = useState<Mode>("listening");
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [transcript, setTranscript] = useState(DEFAULT_TRANSCRIPT);
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>("expense");
  const [question, setQuestion] = useState("How much did I receive this month?");
  const [answer, setAnswer] = useState<Answer>(ANSWERS.month);
  const [success, setSuccess] = useState(
    "Expense added · RWF 15,000 · Transport · Cash",
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typing) inputRef.current?.focus();
  }, [typing]);

  function startListening() {
    setMode("listening");
    setTyping(false);
    setTranscript(DEFAULT_TRANSCRIPT);
    setShowSuccess(false);
    setInput("");
  }

  function stopListening() {
    setConfirmKind("expense");
    setMode("confirm");
    setTyping(false);
  }

  function pickSuggestion(text: string) {
    setTranscript(text);
    setTyping(false);

    if (text === "Add 20 bags of cement") {
      setConfirmKind("stock");
      setMode("confirm");
      return;
    }

    if (text === "Show yesterday's records") {
      setQuestion("Show yesterday's records");
      setAnswer(ANSWERS.yesterday);
      setMode("answer");
      return;
    }

    if (text === "This month's total") {
      setQuestion("How much did I receive this month?");
      setAnswer(ANSWERS.month);
      setMode("answer");
      return;
    }

    setQuestion("Find a customer");
    setAnswer(ANSWERS.customers);
    setMode("answer");
  }

  function confirmAction() {
    setSuccess(
      confirmKind === "expense"
        ? "Expense added · RWF 15,000 · Transport · Cash"
        : "Stock in added · 20 bags of Cement · Ruhango Hardware",
    );
    setShowSuccess(true);
    setQuestion("How much did I receive this month?");
    setAnswer(ANSWERS.month);
    setMode("answer");
  }

  function changeAction() {
    setMode("listening");
    setShowSuccess(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    setTranscript(text);
    setInput("");
    setTyping(false);
    setShowSuccess(false);

    if (/\b(add|expense|stock|sold|buy|bought)\b/i.test(text)) {
      setConfirmKind(/\b(bag|bags|cement|stock)\b/i.test(text) ? "stock" : "expense");
      setMode("confirm");
      return;
    }

    setQuestion(text);
    setAnswer(ANSWERS.month);
    setMode("answer");
  }

  function readAloud() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Money received, one to eleven November: ${answer.amount.replace("RWF", "")} Rwandan francs.`,
    );
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  const status =
    mode === "listening"
      ? typing
        ? "Type a command"
        : "Listening…"
      : mode === "confirm"
        ? "Needs your confirmation"
        : "Answer ready";

  return (
    <div className="voice">
      <div className="voice-head">
        <div className="voice-id">
          <span className="voice-avatar" aria-hidden="true">
            <MicIcon size={20} />
          </span>
          <span>
            <span className="voice-name">Curuza assistant</span>
            <span className="voice-status" aria-live="polite">
              {status}
            </span>
          </span>
        </div>
        <span className="voice-lang">English</span>
      </div>

      <div className="voice-body">
        {mode === "listening" ? (
          <div className="listening">
            <span className="listening-label">
              {typing ? "Type a command" : "Listening…"}
            </span>
            <p className="listening-quote">
              <Transcript text={transcript} />
            </p>
            <div className="wave" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="stop-wrap">
              <button
                type="button"
                className="stop"
                aria-label="Stop and send"
                onClick={stopListening}
              >
                <span />
              </button>
              <span className="stop-hint">Tap to stop</span>
            </div>

            <div className="suggest">
              <span className="suggest-label">You can also say</span>
              <div className="suggest-chips">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="chip"
                    onClick={() => pickSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="type-instead"
                onClick={() => setTyping(true)}
              >
                <KeyboardIcon size={18} />
                Type a command instead
              </button>
            </div>
          </div>
        ) : null}

        {mode === "confirm" ? (
          <div className="thread">
            <div className="bubble">{transcript}</div>

            <div className="confirm-card">
              <div className="confirm-title">
                <UploadIcon size={20} />
                {CONFIRMS[confirmKind].title}
              </div>

              <div className="confirm-grid">
                {CONFIRMS[confirmKind].rows.map((row) => (
                  <Fragment key={row.key}>
                    <span className="confirm-key">{row.key}</span>
                    <span
                      className={`confirm-value${row.amount ? " is-amount" : ""}`}
                    >
                      {row.pill ? (
                        <span className="pill-warn">{row.pill}</span>
                      ) : null}
                      {row.value}
                    </span>
                  </Fragment>
                ))}
              </div>

              <div className="confirm-actions">
                <button type="button" className="yes" onClick={confirmAction}>
                  <CheckIcon size={18} />
                  Yes, add it
                </button>
                <button type="button" className="change" onClick={changeAction}>
                  Change
                </button>
              </div>

              <button
                type="button"
                className="cancel-action"
                onClick={startListening}
              >
                Cancel — don&apos;t add anything
              </button>
            </div>

            <p className="thread-note">
              Nothing changes until you say yes. Actions use your own account
              permissions.
            </p>
          </div>
        ) : null}

        {mode === "answer" ? (
          <div className="thread">
            {showSuccess ? (
              <div className="success-pill">
                <CheckIcon size={16} />
                {success}
              </div>
            ) : null}

            <div className="bubble">{question}</div>

            <div className="answer-card">
              <span className="answer-caption">{answer.caption}</span>
              <span className="answer-amount">{answer.amount}</span>

              <div className="answer-rows">
                {answer.rows.map((row) => (
                  <Fragment key={row.label}>
                    <div className="answer-row">
                      <span>{row.label}</span>
                      <b>{row.value}</b>
                    </div>
                    <div className="bar">
                      <span style={{ width: `${row.width}%` }} />
                    </div>
                  </Fragment>
                ))}
              </div>

              <span className="answer-note">{answer.note}</span>

              <div className="answer-actions">
                <Link href="/sales" className="answer-btn">
                  See the records
                </Link>
                <button
                  type="button"
                  className="answer-btn answer-btn-second"
                  onClick={readAloud}
                >
                  <SpeakerIcon size={18} />
                  Read aloud
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {mode !== "listening" || typing ? (
        <form className="voice-foot" onSubmit={handleSubmit}>
          <label className="flex-1" style={{ display: "flex", flex: 1 }}>
            <span className="sr-only">Type a command</span>
            <input
              ref={inputRef}
              className="voice-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                mode === "confirm" ? "Type or say “yes”" : "Ask or tell Curuza…"
              }
              aria-label="Type a command"
            />
          </label>
          <button
            type="submit"
            className="voice-mic"
            aria-label={mode === "listening" ? "Send command" : "Speak"}
            onClick={() => {
              if (mode === "listening" && !input.trim()) {
                setTyping(false);
              }
            }}
          >
            {mode === "listening" ? (
              <CheckIcon size={22} />
            ) : (
              <MicIcon size={22} />
            )}
          </button>
        </form>
      ) : null}
    </div>
  );
}
