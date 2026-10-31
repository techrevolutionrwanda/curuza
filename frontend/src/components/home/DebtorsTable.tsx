"use client";

import Link from "next/dist/client/link";
import { useState } from "react";
import { useI18n } from "@/i18n/locale-provider";
import { interpolate } from "@/i18n/dictionaries";
import { saleToDebtor } from "@/data/debtors";
import type { Sale } from "@/data/sales";
import { CustomerCard } from "@/components/customers/customer-card";

export function DebtorsTable({ sales }: { sales: Sale[] }) {
  const { t, locale } = useI18n();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const debtors = sales.map(saleToDebtor);

  const dateLabel = (value: string) =>
    new Date(value).toLocaleDateString(locale === "en" ? "en-US" : "rw-RW", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });

  return (
    <>
    <div className="bg-surface rounded-lg p-[22px] shadow-md">
      <div className="flex justify-between items-center mb-[16px] gap-[10px] flex-wrap">
        <div>
          <h3 className="text-[16px] font-bold mb-[2px] text-ink">
            {t.home.debtors.title}
          </h3>
          <div className="text-ink-2 text-[13px]">{t.home.debtors.subtitle}</div>
        </div>
        <Link
          href="/debtors"
          className="h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center"
        >
          {t.home.debtors.cta}
        </Link>
      </div>

      {/* Desktop table */}
      <div className="overflow-x-auto mx-[-8px] hidden md:block">
        <table className="w-full border-collapse min-w-[560px]">
          <thead>
            <tr>
              <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-left px-[12px] py-[10px] border-b border-line font-bold">
                {t.home.debtors.columns.customer}
              </th>
              <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-left px-[12px] py-[10px] border-b border-line font-bold">
                {t.home.debtors.columns.repaid}
              </th>
              <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-right px-[12px] py-[10px] border-b border-line font-bold">
                {t.home.debtors.columns.owed}
              </th>
            </tr>
          </thead>
          <tbody>
            {debtors.map((d, i) => (
              <tr
                key={d.id}
                tabIndex={0}
                aria-label={interpolate(t.common.viewDetails, { name: d.name })}
                onClick={() => setSelectedSale(sales[i])}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedSale(sales[i]);
                  }
                }}
                className="cursor-pointer hover:bg-[#fafcfb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <td
                  className={`px-[12px] py-[14px] align-middle ${
                    i === debtors.length - 1 ? "border-b-0" : "border-b border-line"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-[42px] w-[42px] rounded-[14px] bg-primary-soft text-primary-dark grid place-items-center font-extrabold shrink-0">
                      {d.initial}
                    </div>
                    <div>
                      <b className="block text-ink">{d.name}</b>
                      <span className="text-[12px] text-ink-2">{dateLabel(d.date)}</span>
                    </div>
                  </div>
                </td>
                <td
                  className={`px-[12px] py-[14px] align-middle ${
                    i === debtors.length - 1 ? "border-b-0" : "border-b border-line"
                  }`}
                >
                  <div className="h-[8px] bg-line rounded-full overflow-hidden min-w-[100px]">
                    <i
                      className="block h-full bg-danger"
                      style={{ width: `${d.total > 0 ? Math.round((d.paid / d.total) * 100) : 0}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </td>
                <td
                  className={`text-right px-[12px] py-[14px] align-middle ${
                    i === debtors.length - 1 ? "border-b-0" : "border-b border-line"
                  }`}
                >
                  <b className="text-danger font-nums tracking-[-0.01em]">{d.owed}</b>
                </td>
              </tr>
            ))}
            {debtors.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-sm text-ink-2">
                  {t.home.debtors.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden">
        {debtors.map((d) => (
          <div
            key={d.id}
            role="button"
            tabIndex={0}
            aria-label={interpolate(t.common.viewDetails, { name: d.name })}
            onClick={() => setSelectedSale(sales.find((sale) => sale.id === d.id) ?? null)}
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedSale(sales.find((sale) => sale.id === d.id) ?? null);
              }
            }}
            className="mb-[12px] cursor-pointer rounded-lg border border-line bg-surface p-[16px] transition-colors hover:bg-[#fafcfb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <div className="flex items-center gap-3 mb-[12px]">
              <div className="h-[42px] w-[42px] rounded-[14px] bg-primary-soft text-primary-dark grid place-items-center font-extrabold shrink-0">
                {d.initial}
              </div>
              <div className="flex-1">
                <b className="block text-ink">{d.name}</b>
                <span className="text-[12px] text-ink-2">{dateLabel(d.date)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-[12px]">
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.06em] text-ink-2 font-bold mb-[2px]">
                  {t.home.debtors.columns.repaid}
                </div>
                <div className="h-[8px] bg-line rounded-full overflow-hidden">
                  <i
                    className="block h-full bg-danger"
                    style={{ width: `${d.total > 0 ? Math.round((d.paid / d.total) * 100) : 0}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <b className="text-danger font-nums tracking-[-0.01em] text-right">{d.owed}</b>
            </div>
          </div>
        ))}
        {debtors.length === 0 && (
            <p className="py-4 text-center text-sm text-ink-2">{t.home.debtors.empty}</p>
        )}
      </div>
    </div>
    {selectedSale && (
      <CustomerCard sale={selectedSale} onClose={() => setSelectedSale(null)} />
    )}
    </>
  );
}
