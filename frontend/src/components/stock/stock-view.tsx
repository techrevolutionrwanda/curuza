"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  CATEGORY_IDS,
  stockStatus,
  type CategoryId,
  type Product,
  type StockStatus,
} from "@/data/products";
import { useI18n } from "@/i18n/locale-provider";

const STATUS_TONE: Record<StockStatus, string> = {
  ok: "bg-primary-soft text-primary-dark",
  low: "bg-warning-soft text-warning",
  out: "bg-danger-soft text-danger",
};

const btn =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-panel px-5 font-bold transition";
const btnSm =
  "inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-[11px] px-3.5 text-[13px] font-bold transition";

const inputCls =
  "min-h-12 w-full rounded-panel border border-line bg-surface px-3.5 outline-none transition focus:border-primary";

const thCls =
  "border-b border-line px-3 py-2.5 text-left text-[12px] font-bold uppercase tracking-[0.06em] text-ink-2";
const thRightCls = `${thCls} text-right`;
const tdCls = "border-b border-line px-3 py-3.5 align-middle";

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
}

export function StockView({ initialProducts }: { initialProducts: Product[] }) {
  const { t } = useI18n();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState("all");
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId>(CATEGORY_IDS[0]);
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    nameRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const chips = useMemo(
    () => [
      { key: "all", label: t.stock.chips.all },
      ...CATEGORY_IDS.map((id) => ({ key: id, label: t.stock.categories[id] })),
      { key: "low", label: t.stock.chips.low },
    ],
    [t],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const categoryLabel = t.stock.categories[p.category];
      const status = stockStatus(p.qty);
      const byChip =
        chip === "all"
          ? true
          : chip === "low"
            ? status !== "ok"
            : p.category === chip;
      const byQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        categoryLabel.toLowerCase().includes(q);
      return byChip && byQuery;
    });
  }, [products, query, chip, t]);

  function resetForm() {
    setName("");
    setCategory(CATEGORY_IDS[0]);
    setPrice("");
    setQty("");
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setProducts((prev) => [
      {
        id: `${Date.now()}`,
        name: trimmed,
        initials: initialsFrom(trimmed),
        category,
        price: Number(price) || 0,
        qty: Number(qty) || 0,
      },
      ...prev,
    ]);
    setOpen(false);
    resetForm();
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-24 pt-5 sm:px-8 sm:pb-[60px] sm:pt-7">
      <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight tracking-[-0.02em]">
            {t.stock.title}
          </h1>
          <p className="mt-1 text-ink-2">{t.stock.subtitle}</p>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            className={`${btn} border-[1.5px] border-line bg-surface hover:bg-bg`}
          >
            {t.stock.addCategory}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`${btn} bg-primary text-white hover:bg-primary-dark`}
          >
            + {t.stock.addProduct}
          </button>
        </div>
      </div>

      <div className="rounded-card bg-surface p-5 shadow-card sm:p-[22px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t.stock.columns.category}>
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setChip(c.key)}
                aria-pressed={chip === c.key}
                className={`min-h-[38px] rounded-pill border-[1.5px] px-4 text-[13px] font-semibold transition ${
                  chip === c.key
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-surface hover:bg-bg"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <label className="flex min-h-12 w-full max-w-[340px] items-center gap-2.5 rounded-panel border-[1.5px] border-line bg-surface px-3.5 focus-within:border-primary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-ink-3)"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.stock.searchPlaceholder}
              aria-label={t.stock.searchLabel}
              className="min-h-[46px] w-full border-0 bg-transparent outline-none placeholder:text-ink-3"
            />
          </label>
        </div>

        <div className="mx-[-8px] overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse [&>tbody>tr:last-child>td]:border-b-0 [&>tbody>tr:hover]:bg-[#FAFCFB]">
            <thead>
              <tr>
                <th className={thCls}>{t.stock.columns.product}</th>
                <th className={thCls}>{t.stock.columns.category}</th>
                <th className={thRightCls}>{t.stock.columns.price}</th>
                <th className={thRightCls}>{t.stock.columns.remaining}</th>
                <th className={thCls}>{t.stock.columns.status}</th>
                <th className="border-b border-line px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const status = stockStatus(p.qty);
                return (
                  <tr key={p.id}>
                    <td className={tdCls}>
                      <div className="flex items-center gap-3">
                        <div className="grid h-[42px] w-[42px] flex-none place-items-center rounded-panel bg-primary-soft font-extrabold text-primary-dark">
                          {p.initials}
                        </div>
                        <b>{p.name}</b>
                      </div>
                    </td>
                    <td className={`${tdCls} text-ink-2`}>
                      {t.stock.categories[p.category]}
                    </td>
                    <td className={`num ${tdCls} text-right`}>
                      {p.price.toLocaleString("en-US")}
                    </td>
                    <td className={`num ${tdCls} text-right`}>
                      <b>{p.qty}</b>
                    </td>
                    <td className={tdCls}>
                      <span
                        className={`inline-block whitespace-nowrap rounded-pill px-[11px] py-1 text-[12px] font-extrabold ${STATUS_TONE[status]}`}
                      >
                        {t.stock.status[status]}
                      </span>
                    </td>
                    <td className={`${tdCls} text-right`}>
                      <button
                        type="button"
                        className={`${btnSm} bg-primary-soft text-primary-dark hover:brightness-95`}
                      >
                        {t.stock.add}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="border-b border-line px-3 py-8 text-center text-ink-2"
                  >
                    {t.stock.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[rgba(16,32,27,0.5)] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-label={t.addProduct.title}
            onSubmit={onSubmit}
            className="animate-rise w-full max-w-[520px] rounded-[26px] bg-surface p-[26px] shadow-modal"
          >
            <h2 className="text-[22px] tracking-[-0.02em]">{t.addProduct.title}</h2>
            <p className="mb-4 mt-0.5 text-sm text-ink-2">{t.addProduct.subtitle}</p>

            <label className="mb-2.5 block">
              <span className="mb-1 block text-[13px] font-semibold text-ink-2">
                {t.addProduct.name}
              </span>
              <input
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t.addProduct.namePlaceholder}
                className={inputCls}
              />
            </label>

            <div className="mb-2.5 grid gap-2.5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[13px] font-semibold text-ink-2">
                  {t.addProduct.category}
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className={inputCls}
                >
                  {CATEGORY_IDS.map((id) => (
                    <option key={id} value={id}>
                      {t.stock.categories[id]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[13px] font-semibold text-ink-2">
                  {t.addProduct.price}
                </span>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1800"
                  className={`${inputCls} num`}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-[13px] font-semibold text-ink-2">
                {t.addProduct.qty}
              </span>
              <input
                type="number"
                min={0}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="10"
                className={`${inputCls} num`}
              />
            </label>

            <div className="mt-[18px] flex gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={`${btn} border-[1.5px] border-line bg-surface hover:bg-bg`}
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className={`${btn} flex-1 bg-primary text-white hover:bg-primary-dark`}
              >
                {t.addProduct.submit}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
