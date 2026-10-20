"use client";

import Link from "next/link";
import { stockStatus, type Product } from "@/data/products";
import { interpolate } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/locale-provider";

const badgeStyles: Record<string, string> = {
  low: "bg-warning-soft text-warning",
  out: "bg-danger-soft text-danger",
};

export function RestockList({ products }: { products: Product[] }) {
  const { t } = useI18n();
  const items = products
    .filter((p) => stockStatus(p.qty) !== "ok")
    .sort((a, b) => a.qty - b.qty)
    .slice(0, 6);

  return (
    <div className="bg-surface rounded-lg p-[22px] shadow-md">
      <div className="flex justify-between items-center mb-[16px] gap-[10px] flex-wrap">
        <div>
          <h3 className="text-[16px] font-bold mb-[2px] text-ink">
            {t.home.restock.title}
          </h3>
          <div className="text-ink-2 text-[13px]">{t.home.restock.subtitle}</div>
        </div>
        <Link
          href="/stock"
          className="h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center"
        >
          {t.home.restock.cta}
        </Link>
      </div>
      {items.length === 0 ? (
        <div className="py-[13px] text-ink-2 text-[13px]">
          {t.home.restock.empty}
        </div>
      ) : (
        items.map((item) => {
          const out = stockStatus(item.qty) === "out";
          return (
            <div
              key={item.id}
              className="flex justify-between pt-[13px] pb-[13px] border-b border-line last:border-b-0"
            >
              <span className="text-ink-2">{item.name}</span>
              <span
                className={`inline-block text-[12px] font-extrabold px-[11px] py-[2px] rounded-full whitespace-nowrap ${
                  badgeStyles[out ? "out" : "low"]
                }`}
              >
                {out
                  ? t.home.restock.out
                  : interpolate(t.home.restock.remaining, { count: String(item.qty) })}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
