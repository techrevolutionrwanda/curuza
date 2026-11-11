"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  CheckIcon,
  CloseIcon,
  GalleryIcon,
  KeyboardIcon,
  LightningIcon,
  ShieldIcon,
} from "./icons";

const DOCUMENT_KINDS = ["Receipt", "Invoice", "Handwritten note"];

/**
 * The phone-sized capture and reading screens (screens 2 and 3 of the
 * template). They open in a modal over the review screen and hand control
 * back once the mock AI has "read" the photo.
 */
export function CameraFlow({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: () => void;
}) {
  const [screen, setScreen] = useState<"capture" | "reading">("capture");
  const [kind, setKind] = useState(DOCUMENT_KINDS[0]);
  const [step, setStep] = useState(0);

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

  // Walk the reading checklist, then return to the review screen.
  useEffect(() => {
    if (screen !== "reading") return;

    const halfway = window.setTimeout(() => setStep(1), 750);
    const done = window.setTimeout(onComplete, 2400);

    return () => {
      window.clearTimeout(halfway);
      window.clearTimeout(done);
    };
  }, [screen, onComplete]);

  function startReading() {
    setStep(0);
    setScreen("reading");
  }

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
              <button type="button" className="capture-auto">
                <LightningIcon size={18} />
                Auto
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

            <div className="capture-stage">
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

              <div className="capture-corner tl" aria-hidden="true" />
              <div className="capture-corner tr" aria-hidden="true" />
              <div className="capture-corner bl" aria-hidden="true" />
              <div className="capture-corner br" aria-hidden="true" />

              <div className="capture-found">
                <CheckIcon size={16} strokeWidth={2.4} />
                Page found — hold still
              </div>
            </div>

            <p className="capture-caption">
              Lay the page flat in good light. One page per photo.
            </p>

            <div className="capture-foot">
              <button
                type="button"
                className="capture-side"
                onClick={startReading}
              >
                <span>
                  <GalleryIcon size={22} />
                </span>
                Gallery
              </button>

              <button
                type="button"
                className="capture-shutter"
                aria-label="Take photo"
                onClick={startReading}
              >
                <span />
              </button>

              <button
                type="button"
                className="capture-side"
                onClick={onComplete}
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

            <div className="reading-paper" aria-hidden="true">
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
              <div className="reading-scan" />
            </div>

            <ol className="reading-steps">
              <li className="reading-step">
                <span className="step-done">
                  <CheckIcon size={16} strokeWidth={2.6} />
                </span>
                <span className="reading-step-label">Photo received</span>
                <span className="reading-step-meta">1.2 MB</span>
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
