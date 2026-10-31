"use client";

import { format } from "date-fns";
import type { Sale } from "@/data/sales";
import type { Product } from "@/data/products";
import { useI18n } from "@/i18n/locale-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SaleModal } from "@/components/home/SaleModal";

const cell = "border-b border-line px-3 py-3.5 align-top";

export function SalesView({ sales, products }: { sales: Sale[]; products: Product[] }) {
  const { t } = useI18n();
  const router = useRouter();
  const [saleOpen, setSaleOpen] = useState(false);

  return (
    <main className="mx-auto w-full max-w-[1400px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-ink">{t.sales.title}</h1>
          <p className="mt-1 text-sm text-ink-2">{t.sales.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setSaleOpen(true)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-panel bg-primary px-5 font-bold text-white transition hover:bg-primary-dark"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {t.topbar.newSale}
        </button>
      </div>

      <div className="overflow-x-auto rounded-card bg-surface shadow-card">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead>
            <tr className="bg-bg text-left text-[12px] uppercase text-ink-2">
              <th className="px-3 py-3">{t.sales.columns.date}</th>
              <th className="px-3 py-3">{t.sales.columns.customer}</th>
              <th className="px-3 py-3">{t.sales.columns.phone}</th>
              <th className="px-3 py-3">{t.sales.columns.products}</th>
              <th className="px-3 py-3 text-right">{t.sales.columns.total}</th>
              <th className="px-3 py-3">{t.sales.columns.payment}</th>
              <th className="px-3 py-3 text-right">{t.sales.paid}</th>
              <th className="px-3 py-3 text-right">{t.sales.balance}</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-bg/60">
                <td className={`${cell} whitespace-nowrap text-ink-2`}>
                  {sale.createdAt && format(new Date(sale.createdAt), "PPp")}
                </td>
                <td className={`${cell} font-semibold text-ink`}>
                  {sale.customerName || t.sales.walkIn}
                </td>
                <td className={`${cell} whitespace-nowrap text-ink-2`}>
                  {sale.customerPhone || "-"}
                </td>
                <td className={cell}>
                  <ul className="space-y-1">
                    {sale.items.map((item) => (
                      <li key={`${sale.id}-${item.productId}`} className="whitespace-nowrap">
                        {item.name} × {item.quantity}
                        <span className="ml-2 text-ink-2">
                          {(item.price * item.quantity).toLocaleString("en-US")} RWF
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className={`${cell} whitespace-nowrap text-right font-bold num`}>
                  {sale.total.toLocaleString("en-US")} RWF
                </td>
                <td className={cell}>
                  <span className="inline-flex rounded-pill bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-dark">
                    {t.sales.payment[sale.paymentMethod]}
                  </span>
                </td>
                <td className={`${cell} whitespace-nowrap text-right num`}>
                  {sale.paid.toLocaleString("en-US")} RWF
                </td>
                <td className={`${cell} whitespace-nowrap text-right font-semibold num ${sale.owed > 0 ? "text-danger" : "text-ink-2"}`}>
                  {sale.owed.toLocaleString("en-US")} RWF
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-ink-2">
                  {t.sales.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {saleOpen && (
        <SaleModal
          open
          products={products}
          onClose={() => setSaleOpen(false)}
          onSuccess={() => router.refresh()}
        />
      )}
    </main>
  );
}