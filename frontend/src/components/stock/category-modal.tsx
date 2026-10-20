"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCategoryAction, type ActionResult } from "@/app/stock/_lib/actions";
import { Modal } from "./modal";
import { useI18n } from "@/i18n/locale-provider";

const btn = "inline-flex min-h-12 items-center justify-center gap-2 rounded-panel px-5 font-bold transition";
const inputCls = "min-h-12 w-full rounded-panel border border-line bg-surface px-3.5 outline-none transition focus:border-primary";

export function CategoryModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: (name: string) => void;
}) {
  const { t, locale } = useI18n();
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(createCategoryAction, { ok: false, errors: {} });
  const nameRwRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state.ok) return;
    onSuccess?.(state.name);
    onClose();
  }, [state, onClose, onSuccess]);

  const err = (code: string | undefined) =>
    code ? t.form.errors[code as keyof typeof t.form.errors] ?? code : null;

  return (
    <Modal open={open} onClose={onClose} ariaLabel={t.category.title} initialFocusRef={nameRwRef}>
      <form action={formAction} noValidate>
        <input type="hidden" name="locale" value={locale} />
        <h2 className="text-[22px] tracking-[-0.02em]">{t.category.title}</h2>
        <p className="mb-4 mt-0.5 text-sm text-ink-2">{t.category.subtitle}</p>

        <label className="mb-2.5 block">
          <span className="mb-1 block text-[13px] font-semibold text-ink-2">{t.category.nameRw}</span>
          <input ref={nameRwRef} name="nameRw" className={inputCls} aria-invalid={state.ok === false && !!state.errors.nameRw} />
          {state.ok === false && state.errors.nameRw && (
            <span className="mt-1 block text-xs text-danger">{err(state.errors.nameRw)}</span>
          )}
        </label>

        <label className="block">
          <span className="mb-1 block text-[13px] font-semibold text-ink-2">{t.category.nameEn}</span>
          <input name="nameEn" className={inputCls} aria-invalid={state.ok === false && !!state.errors.nameEn} />
          {state.ok === false && state.errors.nameEn && (
            <span className="mt-1 block text-xs text-danger">{err(state.errors.nameEn)}</span>
          )}
        </label>

        <div className="mt-[18px] flex gap-2.5">
          <button type="button" onClick={onClose} className={`${btn} border-[1.5px] border-line bg-surface hover:bg-bg`}>
            {t.common.cancel}
          </button>
          <button type="submit" disabled={pending} className={`${btn} flex-1 bg-primary text-white hover:bg-primary-dark disabled:opacity-60`}>
            {t.category.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
}
