"use client";

import { useActionState, useEffect } from "react";
import { deleteProductAction, type ActionResult } from "@/lib/stock/actions";
import { Modal } from "./modal";
import { useI18n } from "@/i18n/locale-provider";
import { interpolate } from "@/i18n/dictionaries";

const btn = "inline-flex min-h-12 items-center justify-center gap-2 rounded-panel px-5 font-bold transition";

export function ConfirmDeleteModal({
  open,
  product,
  onClose,
  onSuccess,
}: {
  open: boolean;
  product: { id: string; name: string } | null;
  onClose: () => void;
  onSuccess: (name: string) => void;
}) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(deleteProductAction, { ok: false, errors: {} });

  useEffect(() => {
    if (!state.ok) return;
    onSuccess(state.name);
    onClose();
  }, [state, onClose, onSuccess]);

  return (
    <Modal open={open && !!product} onClose={onClose} ariaLabel={t.delete.title}>
      <form action={formAction} noValidate>
        <input type="hidden" name="id" value={product?.id ?? ""} />
        <h2 className="text-[22px] tracking-[-0.02em]">{t.delete.title}</h2>
        <p className="mb-4 mt-0.5 text-sm text-ink-2">
          {interpolate(t.delete.subtitle, { name: product?.name ?? "" })}
        </p>
        <div className="mt-[18px] flex gap-2.5">
          <button type="button" onClick={onClose} className={`${btn} border-[1.5px] border-line bg-surface hover:bg-bg`}>
            {t.common.cancel}
          </button>
          <button type="submit" disabled={pending} className={`${btn} flex-1 bg-danger text-white hover:brightness-95 disabled:opacity-60`}>
            {t.delete.confirm}
          </button>
        </div>
      </form>
    </Modal>
  );
}
