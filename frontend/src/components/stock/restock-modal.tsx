"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { restockProductAction, type ActionResult } from "@/app/(app)/stock/_lib/actions";
import { Modal } from "./modal";
import { useI18n } from "@/i18n/locale-provider";

const btn = "inline-flex min-h-12 items-center justify-center gap-2 rounded-panel px-5 font-bold transition";
const inputCls = "min-h-12 w-full rounded-panel border border-line bg-surface px-3.5 outline-none transition focus:border-primary";

export function RestockModal({
  open,
  product,
  onClose,
  onSuccess,
}: {
  open: boolean;
  product: { id: string; name: string; qty: number } | null;
  onClose: () => void;
  onSuccess: (name: string) => void;
}) {
  const { t } = useI18n();
  const [amount, setAmount] = useState(1);
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(restockProductAction, { ok: false, errors: {} });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state.ok) return;
    onSuccess(state.name);
    onClose();
  }, [state, onClose, onSuccess]);

  const err = (code: string | undefined) =>
    code ? t.form.errors[code as keyof typeof t.form.errors] ?? code : null;

  const dec = () => setAmount((a) => Math.max(1, a - 1));
  const inc = () => setAmount((a) => a + 1);

  return (
    <Modal open={open && !!product} onClose={onClose} ariaLabel={t.restock.title} initialFocusRef={inputRef}>
      <form action={formAction} noValidate>
        <input type="hidden" name="id" value={product?.id ?? ""} />
        <input type="hidden" name="amount" value={amount} />
        <h2 className="text-[22px] tracking-[-0.02em]">{t.restock.title}</h2>
        <p className="mb-4 mt-0.5 text-sm text-ink-2">{t.restock.subtitle}</p>

        <div className="mb-3 flex items-center justify-between rounded-panel border border-line bg-bg px-4 py-2">
          <div>
            <div className="text-sm font-semibold">{product?.name}</div>
            <div className="text-xs text-ink-2">
              {t.restock.current}: <span className="num">{product?.qty}</span>
            </div>
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block text-[13px] font-semibold text-ink-2">{t.restock.qty}</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={dec} className={`${btn} border border-line bg-surface px-3`}>−</button>
            <input
              ref={inputRef}
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
              className={`${inputCls} num max-w-[160px]`}
            />
            <button type="button" onClick={inc} className={`${btn} border border-line bg-surface px-3`}>+</button>
          </div>
          {state.ok === false && state.errors.amount && (
            <span className="mt-1 block text-xs text-danger">{err(state.errors.amount)}</span>
          )}
        </label>

        <div className="mt-[18px] flex gap-2.5">
          <button type="button" onClick={onClose} className={`${btn} border-[1.5px] border-line bg-surface hover:bg-bg`}>
            {t.common.cancel}
          </button>
          <button type="submit" disabled={pending} className={`${btn} flex-1 bg-primary text-white hover:bg-primary-dark disabled:opacity-60`}>
            {t.restock.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
}
