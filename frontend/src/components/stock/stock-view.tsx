"use client";

import { useCallback, useMemo, useState } from "react";
import { stockStatus, type Category, type Product } from "@/data/products";
import { useI18n } from "@/i18n/locale-provider";
import { RowMenu } from "./row-menu";
import { ProductModal } from "./product-modal";
import { CategoryModal } from "./category-modal";
import { RestockModal } from "./restock-modal";
import { ConfirmDeleteModal } from "./confirm-modal";
import { Toast, type ToastMsg } from "./toast";

const STATUS_TONE = {
  ok: "bg-primary-soft text-primary-dark",
  low: "bg-warning-soft text-warning",
  out: "bg-danger-soft text-danger",
} as const;

const btn = "inline-flex min-h-12 items-center justify-center gap-2 rounded-panel px-5 font-bold transition";
const btnSm = "inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-[11px] px-3.5 text-[13px] font-bold transition";

const thCls = "border-b border-line px-3 py-2.5 text-left text-[12px] font-bold uppercase tracking-[0.06em] text-ink-2";
const thRightCls = `${thCls} text-right`;
const tdCls = "border-b border-line px-3 py-3.5 align-middle";

export function StockView({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const { t, locale } = useI18n();

  const [query, setQuery] = useState("");
  const [chip, setChip] = useState("all");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [restockProduct, setRestockProduct] = useState<{ id: string; name: string; qty: number } | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<{ id: string; name: string } | null>(null);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const chips = useMemo(() => {
    const custom = categories
      .filter((c) => !["ibinyobwa", "ibiribwa", "isuku"].includes(c.id))
      .map((c) => ({ key: c.id, label: c.label[locale] ?? c.label.rw }));
    return [
      { key: "all", label: t.stock.chips.all },
      ...["ibinyobwa", "ibiribwa", "isuku"].map((id) => {
        const c = categories.find((x) => x.id === id);
        return { key: id, label: c ? c.label[locale] ?? c.label.rw : id };
      }),
      ...custom,
      { key: "low", label: t.stock.chips.low },
    ];
  }, [categories, t, locale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const cat = categories.find((c) => c.id === p.category);
      const categoryLabel = cat ? cat.label[locale] ?? cat.label.rw : p.category;
      const status = stockStatus(p.qty);
      const byChip =
        chip === "all" ? true : chip === "low" ? status !== "ok" : p.category === chip;
      const byQuery = !q || p.name.toLowerCase().includes(q) || categoryLabel.toLowerCase().includes(q);
      return byChip && byQuery;
    });
  }, [products, query, chip, categories, locale]);

  const pushToast = useCallback((msg: ToastMsg) => {
    setToasts((ts) => [...ts, msg]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((ts) => ts.filter((x) => x.id !== id));
  }, []);

  function toastId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-24 pt-5 sm:px-8 sm:pb-[60px] sm:pt-7">
      <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight tracking-[-0.02em]">{t.stock.title}</h1>
          <p className="mt-1 text-ink-2">{t.stock.subtitle}</p>
        </div>
        <div className="flex gap-2.5">
          <button type="button" onClick={() => setAddCategoryOpen(true)} className={`${btn} border-[1.5px] border-line bg-surface hover:bg-bg`}>
            {t.stock.addCategory}
          </button>
          <button type="button" onClick={() => setAddProductOpen(true)} className={`${btn} bg-primary text-white hover:bg-primary-dark`}>
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
                  chip === c.key ? "border-primary bg-primary text-white" : "border-line bg-surface hover:bg-bg"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <label className="flex min-h-12 w-full max-w-[340px] items-center gap-2.5 rounded-panel border-[1.5px] border-line bg-surface px-3.5 focus-within:border-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-3)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
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
                const cat = categories.find((c) => c.id === p.category);
                const categoryLabel = cat ? cat.label[locale] ?? cat.label.rw : p.category;
                const isMenuOpen = menuOpenId === p.id;
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
                    <td className={`${tdCls} text-ink-2`}>{categoryLabel}</td>
                    <td className={`num ${tdCls} text-right`}>{p.price.toLocaleString("en-US")}</td>
                    <td className={`num ${tdCls} text-right`}>
                      <b>{p.qty}</b>
                    </td>
                    <td className={tdCls}>
                      <span className={`inline-block whitespace-nowrap rounded-pill px-[11px] py-1 text-[12px] font-extrabold ${STATUS_TONE[status]}`}>
                        {t.stock.status[status]}
                      </span>
                    </td>
                    <td className={`${tdCls} relative text-right`}>
                      <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={isMenuOpen}
                        onClick={() => setMenuOpenId((id) => (id === p.id ? null : p.id))}
                        className={`${btnSm} bg-primary-soft text-primary-dark hover:brightness-95`}
                      >
                        ⋯
                      </button>
                      <RowMenu
                        open={isMenuOpen}
                        onClose={() => setMenuOpenId(null)}
                        onRestock={() => setRestockProduct({ id: p.id, name: p.name, qty: p.qty })}
                        onEdit={() => setEditProduct(p)}
                        onDelete={() => setDeleteProduct({ id: p.id, name: p.name })}
                      />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="border-b border-line px-3 py-8 text-center text-ink-2">
                    {t.stock.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {addProductOpen && (
        <ProductModal
          open
          mode="create"
          categories={categories}
          onClose={() => setAddProductOpen(false)}
          onSuccess={(name) => pushToast({ id: toastId(), key: "productAdded", name })}
        />
      )}
      {editProduct && (
        <ProductModal
          open
          mode="edit"
          product={editProduct}
          categories={categories}
          onClose={() => setEditProduct(null)}
          onSuccess={(name) => pushToast({ id: toastId(), key: "productUpdated", name })}
        />
      )}
      {addCategoryOpen && (
        <CategoryModal
          open
          onClose={() => setAddCategoryOpen(false)}
          onSuccess={(name) => pushToast({ id: toastId(), key: "categoryAdded", name })}
        />
      )}
      {restockProduct && (
        <RestockModal
          open
          product={restockProduct}
          onClose={() => setRestockProduct(null)}
          onSuccess={(name) => pushToast({ id: toastId(), key: "restocked", name })}
        />
      )}
      {deleteProduct && (
        <ConfirmDeleteModal
          open
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onSuccess={(name) => pushToast({ id: toastId(), key: "productDeleted", name })}
        />
      )}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}
