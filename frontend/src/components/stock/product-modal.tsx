"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createProductAction, updateProductAction, type ActionResult } from "@/app/stock/_lib/actions";
import { Modal } from "./modal";
import { useI18n } from "@/i18n/locale-provider";
import type { Category, Product } from "@/data/products";

const btn = "inline-flex min-h-12 items-center justify-center gap-2 rounded-panel px-5 font-bold transition";
const inputCls = "min-h-12 w-full rounded-panel border border-line bg-surface px-3.5 outline-none transition focus:border-primary";

type Mode = "create" | "edit";

export function ProductModal({
  open,
  mode,
  product,
  categories,
  onClose,
  onSuccess,
}: {
  open: boolean;
  mode: Mode;
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: (name: string) => void;
}) {
  const { t, locale } = useI18n();
  const action = mode === "edit" ? updateProductAction : createProductAction;
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(action, { ok: false, errors: {} });
  const nameRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? categories[0]?.id ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [qty, setQty] = useState(product ? String(product.qty) : "");

  useEffect(() => {
    if (!state.ok) return;
    onSuccess(state.name);
    onClose();
  }, [state, onClose, onSuccess]);

  const err = (code: string | undefined) =>
    code ? t.form.errors[code as keyof typeof t.form.errors] ?? code : null;

  const title = mode === "edit" ? t.edit.title : t.addProduct.title;
  const subtitle = mode === "edit" ? "" : t.addProduct.subtitle;

  return (
    <Modal open={open} onClose={onClose} ariaLabel={title} initialFocusRef={nameRef}>
      <form action={formAction} noValidate>
        {mode === "edit" && product && <input type="hidden" name="id" value={product.id} />}
        <h2 className="text-[22px] tracking-[-0.02em]">{title}</h2>
        {subtitle && <p className="mb-4 mt-0.5 text-sm text-ink-2">{subtitle}</p>}

        <label className="mb-2.5 block">
          <span className="mb-1 block text-[13px] font-semibold text-ink-2">{t.addProduct.name}</span>
          <input ref={nameRef} name="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} aria-invalid={state.ok === false && !!state.errors.name} />
          {state.ok === false && state.errors.name && (
            <span className="mt-1 block text-xs text-danger">{err(state.errors.name)}</span>
          )}
        </label>

        <div className="mb-2.5 grid gap-2.5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold text-ink-2">{t.addProduct.category}</span>
            <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label[locale] ?? c.label.rw}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold text-ink-2">{t.addProduct.price}</span>
            <input name="price" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className={`${inputCls} num`} aria-invalid={state.ok === false && !!state.errors.price} />
            {state.ok === false && state.errors.price && (
              <span className="mt-1 block text-xs text-danger">{err(state.errors.price)}</span>
            )}
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-[13px] font-semibold text-ink-2">{t.addProduct.qty}</span>
          <input name="qty" type="number" min={0} value={qty} onChange={(e) => setQty(e.target.value)} className={`${inputCls} num`} aria-invalid={state.ok === false && !!state.errors.qty} />
          {state.ok === false && state.errors.qty && (
            <span className="mt-1 block text-xs text-danger">{err(state.errors.qty)}</span>
          )}
        </label>

        <div className="mt-[18px] flex gap-2.5">
          <button type="button" onClick={onClose} className={`${btn} border-[1.5px] border-line bg-surface hover:bg-bg`}>
            {t.common.cancel}
          </button>
          <button type="submit" disabled={pending} className={`${btn} flex-1 bg-primary text-white hover:bg-primary-dark disabled:opacity-60`}>
            {t.addProduct.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
}
