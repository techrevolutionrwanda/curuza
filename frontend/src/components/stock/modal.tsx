"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel: string;
  initialFocusRef?: React.RefObject<HTMLInputElement | HTMLSelectElement | null>;
};

export function Modal({
  open,
  onClose,
  children,
  ariaLabel,
  initialFocusRef,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    const el = initialFocusRef?.current ?? dialogRef.current?.querySelector<HTMLElement>("input, select, button");
    setTimeout(() => el?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose, initialFocusRef]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(16,32,27,0.5)] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className="animate-rise w-full max-w-[520px] rounded-[26px] bg-surface p-[26px] shadow-modal"
      >
        {children}
      </div>
    </div>
  );
}
