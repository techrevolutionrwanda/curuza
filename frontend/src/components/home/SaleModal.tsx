"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import type { SalePaymentMethod } from "@/data/sales";
import { useI18n } from "@/i18n/locale-provider";
import { createSale } from "@/lib/sales-api";
import { QtyStepper } from "./QtyStepper";
import { PaymentToggle } from "./PaymentToggle";

interface SaleModalProps {
  open: boolean;
  products: Product[];
  onClose: () => void;
  onSuccess: () => void;
}

const inputCls = "min-h-11 w-full rounded-panel border border-line bg-surface px-3 outline-none focus:border-primary";

export function SaleModal({ open, products, onClose, onSuccess }: SaleModalProps) {
  const { t } = useI18n();
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(products.map((product) => [product.id, 0])),
  );
  const [productSearch, setProductSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<SalePaymentMethod>("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedItems = useMemo(
    () => products.filter((product) => (quantities[product.id] ?? 0) > 0),
    [products, quantities],
  );
  const visibleProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      `${product.name} ${product.initials} ${product.category}`
        .toLowerCase()
        .includes(query),
    );
  }, [productSearch, products]);
  const total = selectedItems.reduce(
    (sum, product) => sum + product.price * quantities[product.id],
    0,
  );
  const paid =
    paymentMethod === "cash"
      ? total
      : paymentMethod === "credit"
        ? 0
        : Number(amountReceived);

  // Close the sale modal on Escape while it is open.
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  async function submitSale() {
    setError("");
    if (selectedItems.length === 0) {
      setError(t.home.sale.noProducts);
      return;
    }
    if (paymentMethod === "partial" && (!Number.isSafeInteger(paid) || paid <= 0 || paid >= total)) {
      setError(t.home.sale.error);
      return;
    }
    if (paid < total && (!customerName.trim() || !customerPhone.trim())) {
      setError(t.home.sale.customerRequired);
      return;
    }

    setSaving(true);
    try {
      await createSale({
        items: selectedItems.map((product) => ({
          productId: product.id,
          quantity: quantities[product.id],
        })),
        paymentMethod,
        paid,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
      });
      onSuccess();
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.home.sale.error);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[50] p-[16px] grid place-items-center bg-[#10201b]/50"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sale-title"
        className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[26px] bg-surface p-[26px] shadow-[0_30px_80px_rgba(0,0,0,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="sale-title" className="text-[22px] font-bold tracking-[-0.02em] text-ink">
          {t.home.sale.title}
        </h2>
        <div className="text-ink-2 text-[14px] mb-[16px]">
          {t.home.sale.subtitle}
        </div>
        <form onSubmit={(event) => { event.preventDefault(); void submitSale(); }}>
        {products.length > 0 && (
          <label className="mb-3 flex min-h-11 items-center gap-2 rounded-panel border border-line bg-surface px-3 focus-within:border-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              type="search"
              aria-label={t.home.sale.searchProducts}
              placeholder={t.home.sale.searchProducts}
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              className="min-h-10 w-full bg-transparent outline-none placeholder:text-ink-3"
            />
          </label>
        )}
        {visibleProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 border border-line rounded-[14px] p-[10px_14px] mb-[10px]"
          >
            <div className="flex-1">
              <b className="block text-ink">{product.name}</b>
              <span className="block text-[13px] text-ink-2 font-nums">
                {product.price.toLocaleString("en-US")} RWF · {product.qty} in stock
              </span>
            </div>
            <QtyStepper
              value={quantities[product.id] ?? 0}
              max={product.qty}
              onChange={(next) => {
                setQuantities((current) => ({ ...current, [product.id]: next }));
              }}
            />
          </div>
        ))}
        {products.length === 0 && (
          <p className="rounded-panel bg-bg px-3 py-3 text-sm text-ink-2">{t.home.sale.noProducts}</p>
        )}
        {products.length > 0 && visibleProducts.length === 0 && (
          <p className="rounded-panel bg-bg px-3 py-3 text-sm text-ink-2">{t.home.sale.noMatchingProducts}</p>
        )}
        {products.length > 0 && selectedItems.length === 0 && (
          <p className="mt-3 text-sm text-ink-2">{t.home.sale.selectProducts}</p>
        )}
        {selectedItems.length > 0 && (
          <>
        <PaymentToggle value={paymentMethod} onChange={setPaymentMethod} />
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <label className="text-[13px] font-semibold text-ink-2">
            {t.home.sale.customerName}
            <input
              autoComplete="name"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              required={paymentMethod !== "cash"}
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className="text-[13px] font-semibold text-ink-2">
            {t.home.sale.customerPhone}
            <input
              autoComplete="tel"
              type="tel"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              required={paymentMethod !== "cash"}
              className={`${inputCls} mt-1`}
            />
          </label>
        </div>
        {paymentMethod === "partial" && (
          <label className="mb-3 block text-[13px] font-semibold text-ink-2">
            {t.home.sale.amountReceived}
            <input type="number" min={1} max={Math.max(0, total - 1)} step={1} value={amountReceived} onChange={(event) => setAmountReceived(event.target.value)} className={`${inputCls} mt-1 num`} />
          </label>
        )}
        {error && <p role="alert" className="mb-3 text-sm font-semibold text-danger">{error}</p>}
        <div className="flex justify-between items-baseline mb-[18px] mt-[12px]">
          <span className="text-ink-2">{t.home.sale.total}</span>
          <b className="text-[30px] font-bold text-ink font-nums">
            {total.toLocaleString("en-US")} RWF
          </b>
        </div>
          </>
        )}
        <div className="flex gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-[48px] px-[20px] rounded-[14px] font-bold border border-line border-[1.5px] bg-surface text-ink"
          >
            {t.home.sale.cancel}
          </button>
          <button
            type="submit"
            disabled={saving || products.length === 0 || selectedItems.length === 0}
            className="flex-1 h-[48px] px-[20px] rounded-[14px] font-bold bg-primary text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : t.home.sale.save}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
