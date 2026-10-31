"use client";

import { stockStatus, type Product } from "@/data/products";
import { interpolate } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/locale-provider";
import type { Sale } from "@/data/sales";
import { sumSales } from "@/data/sales";
import { KpiCard } from "./KpiCard";

const ICONS = {
  sales: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 17l6-6 4 4 8-8" />
    </svg>
  ),
  cash: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ),
  debtors: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  lowStock: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 3.4 0z" />
    </svg>
  ),
};

export function KpiRow({
  products,
  sales,
  period,
}: {
  products: Product[];
  sales: Sale[];
  period: number;
}) {
  const { t } = useI18n();
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (period === 1) {
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  } else if (period === 2) {
    start.setDate(1);
  }
  const periodSales = sales.filter((sale) => new Date(sale.createdAt) >= start);
  const low = products.filter((p) => stockStatus(p.qty) === "low").length;
  const out = products.filter((p) => stockStatus(p.qty) === "out").length;
  const k = t.home.kpis;
  const debtorSales = periodSales.filter((sale) => sale.owed > 0);
  const customerCount = new Set(debtorSales.map((sale) => sale.customerPhone)).size;
  const amount = (value: number) => value.toLocaleString("en-US");

  const kpis = [
    {
      variant: "hero" as const,
      icon: ICONS.sales,
      label: k.sales.label,
      value: amount(sumSales(periodSales, (sale) => sale.total)),
      unit: "RWF",
    },
    {
      variant: "default" as const,
      icon: ICONS.cash,
      label: k.cash.label,
      value: amount(sumSales(periodSales, (sale) => sale.paid)),
      unit: "RWF",
      trendColor: "up" as const,
    },
    {
      variant: "default" as const,
      icon: ICONS.debtors,
      label: k.debtors.label,
      value: amount(sumSales(periodSales, (sale) => sale.owed)),
      unit: "RWF",
      trend: interpolate(k.debtors.trend, { count: String(customerCount) }),
      iconColor: "red" as const,
      trendColor: "down" as const,
    },
    {
      variant: "default" as const,
      icon: ICONS.lowStock,
      label: k.lowStock.label,
      value: String(low),
      unit: k.lowStock.unit,
      trend: interpolate(k.lowStock.trend, { count: String(out) }),
      iconColor: "yellow" as const,
      trendColor: "down" as const,
    },
  ];

  return (
    <div className="home-kpis grid grid-cols-4 gap-[16px] mb-[20px]">
      {kpis.map((kpi, i) => (
        <KpiCard key={i} {...kpi} />
      ))}
    </div>
  );
}
