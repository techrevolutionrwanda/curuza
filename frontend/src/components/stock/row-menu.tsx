"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/locale-provider";

type RowMenuProps = {
  open: boolean;
  onClose: () => void;
  onRestock: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const btnSm = "inline-flex min-h-[36px] items-center justify-start gap-1.5 rounded-[10px] px-3 text-[13px] font-semibold transition hover:bg-bg";

export function RowMenu({ open, onClose, onRestock, onEdit, onDelete }: RowMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    addEventListener("mousedown", onClick);
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("mousedown", onClick);
      removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={t.menu.ariaLabel}
      className="absolute right-0 top-full z-40 mt-2 flex min-w-[160px] flex-col rounded-panel border border-line bg-surface p-1 shadow-card"
    >
      <button type="button" role="menuitem" className={btnSm} onClick={() => { onRestock(); onClose(); }}>
        {t.row.restock}
      </button>
      <button type="button" role="menuitem" className={btnSm} onClick={() => { onEdit(); onClose(); }}>
        {t.row.edit}
      </button>
      <button type="button" role="menuitem" className={btnSm} onClick={() => { onDelete(); onClose(); }}>
        {t.row.delete}
      </button>
    </div>
  );
}
