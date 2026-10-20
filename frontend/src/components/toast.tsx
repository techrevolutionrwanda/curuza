"use client";

import { useEffect, useState } from "react";
import { useI18n, type Dictionary } from "@/i18n/locale-provider";
import { interpolate } from "@/i18n/dictionaries";

export type ToastMsg = {
  id: string;
  key: keyof Dictionary["toast"];
  name?: string;
};

type ToastProps = {
  toasts: ToastMsg[];
  onDismiss: (id: string) => void;
};

export function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} msg={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  msg,
  onDismiss,
}: {
  msg: ToastMsg;
  onDismiss: (id: string) => void;
}) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), 3000);
    const remove = setTimeout(() => onDismiss(msg.id), 3300);
    return () => {
      clearTimeout(hide);
      clearTimeout(remove);
    };
  }, [msg.id, onDismiss]);

  const text = interpolate(t.toast[msg.key as keyof typeof t.toast], msg.name ? { name: msg.name } : {});
  return (
    <div
      className={`animate-rise rounded-panel border border-line bg-surface px-4 py-2 shadow-card transition ${visible ? "opacity-100" : "opacity-0"}`}
      role="status"
    >
      {text}
    </div>
  );
}
