"use client";

import { useState } from "react";
import { ProfitCard } from "./profit-card";
import { ReportsHead } from "./reports-head";
import { SummaryCard } from "./summary-card";
import { TopCategoriesCard } from "./top-categories-card";
import { sumSales, type Sale } from "@/data/sales";
import type { Category } from "@/data/products";
import { useI18n } from "@/i18n/locale-provider";

/**
 * The reports page.
 *
 * The layout follows the `#reports` section of
 * templates/smart-ledger-web.html: a page head, then the profit and the
 * summary side by side, then the top categories.
 */
export function ReportsView({
  sales,
  categories,
}: {
  sales: Sale[];
  categories: Category[];
}) {
  const [period, setPeriod] = useState(0);
  const { locale } = useI18n();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  if (period === 1) {
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  } else if (period === 2) {
    start.setDate(1);
  }
  const periodSales = sales.filter((sale) => new Date(sale.createdAt) >= start);
  const categorySales = new Map<string, number>();
  for (const sale of periodSales) {
    for (const item of sale.items) {
      categorySales.set(item.category, (categorySales.get(item.category) ?? 0) + item.quantity);
    }
  }
  const topCategories = [...categorySales]
    .map(([id, count]) => {
      const category = categories.find((item) => item.id === id);
      return {
        id,
        name: category?.label[locale] ?? category?.label.rw ?? id,
        count,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="w-full">
      <ReportsHead period={period} onPeriodChange={setPeriod} />

      <div className="mb-[18px] grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:gap-[18px]">
        <ProfitCard sales={periodSales} total={sumSales(periodSales, (sale) => sale.total)} />
        <SummaryCard
          sales={sumSales(periodSales, (sale) => sale.total)}
          collected={sumSales(periodSales, (sale) => sale.paid)}
          owed={sumSales(periodSales, (sale) => sale.owed)}
        />
      </div>

      <TopCategoriesCard categories={topCategories} />
    </div>
  );
}
