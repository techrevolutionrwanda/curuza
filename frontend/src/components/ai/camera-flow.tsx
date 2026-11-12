"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  CloseIcon,
  GalleryIcon,
  KeyboardIcon,
  ShieldIcon,
} from "./icons";

const DOCUMENT_KINDS = ["Receipt", "Invoice", "Handwritten note"];

type CameraStatus = "starting" | "ready" | "unavailable";

const MAX_PHOTO_EDGE = 1600;

function describeCameraError(error: unknown) {
  const name =
    typeof error === "object" && error !== null && "name" in error
      ? String((error as { name: unknown }).name)
      : "";

  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Camera access was blocked. Allow it in your browser, or use Gallery.";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "No camera found. Use Gallery to pick a photo instead.";
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return "The camera is busy in another app. Close it, or use Gallery.";
  }
  return "Camera unavailable. Use Gallery to pick a photo instead.";
}

function formatPhotoSize(dataUrl: string | null) {
  if (!dataUrl) return "";
  const base64 = dataUrl.split(",")[1] ?? "";
  const bytes = Math.round((base64.length * 3) / 4);
  if (!bytes) return "";
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * The phone-sized capture and reading screens (screens 2 and 3 of the
 * template). The capture screen uses the device camera through getUserMedia;
 * when no camera is available it falls back to the mock page and still allows
 * picking a photo from the gallery.
 */
export function CameraFlow({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: (photo?: string) => void;
}) {
  const [screen, setScreen] = useState<"capture" | "reading">("capture");
  const [kind, setKind] = useState(DOCUMENT_KINDS[0]);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<CameraStatus>("starting");
  const [statusText, setStatusText] = useState("Starting camera…");
  const [photo, setPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const photoRef = useRef<string | null>(null);

  // Lock the page behind the modal and close it with Escape.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  // Open the real camera while the capture screen is showing and release it
  // as soon as we leave the screen or the component unmounts.
  useEffect(() => {
    if (screen !== "capture") return;

    let cancelled = false;
    let stream: MediaStream | null = null;
    const video = videoRef.current;

    async function start() {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setStatus("unavailable");
        setStatusText("This browser can't use the camera. Use Gallery instead.");
        return;
      }

      setStatus("starting");
      setStatusText("Starting camera…");

      try {
        const next = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        if (cancelled) {
          next.getTracks().forEach((track) => track.stop());
          return;
        }

        stream = next;
        if (video) {
          video.srcObject = next;
          await video.play().catch(() => undefined);
        }
        if (!cancelled) {
          setStatus("ready");
          setStatusText("Page found — hold still");
        }
      } catch (error) {
        if (cancelled) return;
        setStatus("unavailable");
        setStatusText(describeCameraError(error));
      }
    }

    start();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
      if (video) video.srcObject = null;
    };
  }, [screen, facing]);

  // Walk the reading checklist, then return to the review screen.
  useEffect(() => {
    if (screen !== "reading") return;

    const halfway = window.setTimeout(() => setStep(1), 750);
    const done = window.setTimeout(
      () => onComplete(photoRef.current ?? undefined),
      2400,
    );

    return () => {
      window.clearTimeout(halfway);
      window.clearTimeout(done);
    };
  }, [screen, onComplete]);

  function startReading(nextPhoto: string | null) {
    photoRef.current = nextPhoto;
    setPhoto(nextPhoto);
    setStep(0);
    setScreen("reading");
  }

  function takePhoto() {
    const video = videoRef.current;

    if (status !== "ready" || !video || !video.videoWidth) {
      startReading(null);
      return;
    }

    const scale = Math.min(
      1,
      MAX_PHOTO_EDGE / Math.max(video.videoWidth, video.videoHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);

    const context = canvas.getContext("2d");
    if (!context) {
      startReading(null);
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    startReading(canvas.toDataURL("image/jpeg", 0.9));
  }

  function pickFromGallery(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") startReading(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const photoSize = formatPhotoSize(photo);

  return (
    <div
      className="phone-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="phone"
        role="dialog"
        aria-modal="true"
        aria-label={screen === "capture" ? "Scan a record" : "Reading your photo"}
      >
        {screen === "capture" ? (
          <div className="capture">
            <div className="capture-head">
              <button
                type="button"
                className="capture-icon"
                aria-label="Close scanner"
                onClick={onClose}
                autoFocus
              >
                <CloseIcon size={20} />
              </button>
              <span className="capture-title">Scan a record</span>
              <button
                type="button"
                className="capture-auto"
                aria-label="Switch camera"
                title="Switch camera"
                onClick={() =>
                  setFacing((current) =>
                    current === "environment" ? "user" : "environment",
                  )
                }
              >
                <CameraIcon size={18} />
                Flip
              </button>
            </div>

            <div className="capture-chips" role="group" aria-label="Document type">
              {DOCUMENT_KINDS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="capture-chip"
                  aria-pressed={kind === option}
                  onClick={() => setKind(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div
              className={`capture-stage${status === "ready" ? " is-live" : ""}`}
            >
              <video
                ref={videoRef}
                className="capture-video"
                autoPlay
                playsInline
                muted
                aria-label="Camera preview"
              />

              {status !== "ready" ? (
                <div className="capture-fallback">
                  <div className="capture-paper" aria-hidden="true">
                    <div className="p-title" />
                    <div className="p-sub" />
                    <div className="p-rule" />
                    <div className="p-row">
                      <div className="p-cell" style={{ width: "55%" }} />
                      <div className="p-cell" style={{ width: "20%" }} />
                    </div>
                    <div className="p-row">
                      <div className="p-cell" style={{ width: "45%" }} />
                      <div className="p-cell" style={{ width: "18%" }} />
                    </div>
                    <div className="p-row">
                      <div className="p-cell" style={{ width: "50%" }} />
                      <div className="p-cell" style={{ width: "22%" }} />
                    </div>
                    <div className="p-rule" />
                    <div className="p-row">
                      <div className="p-total" style={{ width: "30%" }} />
                      <div className="p-total" style={{ width: "28%" }} />
                    </div>
                  </div>

                  <p className="capture-status" role="status">
                    {statusText}
                  </p>
                </div>
              ) : null}

              <div className="capture-corner tl" aria-hidden="true" />
              <div className="capture-corner tr" aria-hidden="true" />
              <div className="capture-corner bl" aria-hidden="true" />
              <div className="capture-corner br" aria-hidden="true" />

              {status === "ready" ? (
                <div className="capture-found">
                  <CheckIcon size={16} strokeWidth={2.4} />
                  Page found — hold still
                </div>
              ) : null}
            </div>

            <p className="capture-caption">
              Lay the page flat in good light. One page per photo.
            </p>

            <div className="capture-foot">
              <button
                type="button"
                className="capture-side"
                onClick={() => fileRef.current?.click()}
              >
                <span>
                  <GalleryIcon size={22} />
                </span>
                Gallery
              </button>

              <input
                ref={fileRef}
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={pickFromGallery}
                aria-label="Choose a photo from the gallery"
              />

              <button
                type="button"
                className="capture-shutter"
                aria-label="Take photo"
                disabled={status !== "ready"}
                onClick={takePhoto}
              >
                <span />
              </button>

              <button
                type="button"
                className="capture-side"
                onClick={() => onComplete()}
              >
                <span>
                  <KeyboardIcon size={22} />
                </span>
                Type it
              </button>
            </div>
          </div>
        ) : (
          <div className="reading">
            <div className="reading-head">
              <button
                type="button"
                className="reading-back"
                aria-label="Back to camera"
                onClick={() => setScreen("capture")}
              >
                <ArrowLeftIcon size={22} />
              </button>
              <span className="reading-title">Reading your photo</span>
            </div>

            <div
              className={`reading-paper${photo ? " has-photo" : ""}`}
              aria-hidden="true"
            >
              {photo ? (
                // Data URLs from the camera/gallery can't go through next/image.
                // eslint-disable-next-line @next/next/no-img-element
                <img className="reading-photo" src={photo} alt="" />
              ) : (
                <>
                  <div className="p-title" />
                  <div className="p-sub" />
                  <div className="p-rule" />
                  <div className="p-row r-outline">
                    <div className="p-cell" style={{ width: "55%" }} />
                    <div className="p-cell" style={{ width: "20%" }} />
                  </div>
                  <div className="p-row r-outline">
                    <div className="p-cell" style={{ width: "45%" }} />
                    <div className="p-cell" style={{ width: "18%" }} />
                  </div>
                  <div className="p-row r-outline-amber">
                    <div className="p-cell" style={{ width: "50%" }} />
                    <div className="p-cell" style={{ width: "22%" }} />
                  </div>
                  <div className="p-rule" />
                  <div className="p-row">
                    <div className="p-total" style={{ width: "30%" }} />
                    <div className="p-total" style={{ width: "28%" }} />
                  </div>
                </>
              )}
              <div className="reading-scan" />
            </div>

            <ol className="reading-steps">
              <li className="reading-step">
                <span className="step-done">
                  <CheckIcon size={16} strokeWidth={2.6} />
                </span>
                <span className="reading-step-label">Photo received</span>
                {photoSize ? (
                  <span className="reading-step-meta">{photoSize}</span>
                ) : null}
              </li>
              <li className="reading-step">
                {step === 0 ? (
                  <span className="step-spin" aria-hidden="true" />
                ) : (
                  <span className="step-done">
                    <CheckIcon size={16} strokeWidth={2.6} />
                  </span>
                )}
                <span className="reading-step-label">
                  Reading text, numbers and dates
                </span>
              </li>
              <li className="reading-step">
                {step === 0 ? (
                  <span className="step-pending" aria-hidden="true" />
                ) : (
                  <span className="step-spin" aria-hidden="true" />
                )}
                <span className="reading-step-label">
                  Filling in Curuza fields
                </span>
                <span className="reading-step-meta">about 3 s</span>
              </li>
            </ol>

            <div className="note">
              <ShieldIcon size={20} className="note-icon" />
              <span>
                <b>Nothing is saved yet.</b> You&apos;ll check every field before
                it goes into Curuza.
              </span>
            </div>

            <button
              type="button"
              className="reading-cancel"
              onClick={() => setScreen("capture")}
            >
              Cancel and retake
            </button>

            <span className="sr-only" role="status">
              {step === 0
                ? "Reading the photo"
                : "Filling in the Curuza fields"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
