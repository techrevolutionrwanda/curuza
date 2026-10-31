"use client";

import { BarChart, type ChartBar } from "@/components/BarChart";
import { useI18n } from "@/i18n/locale-provider";
import type { Sale } from "@/data/sales";
import { sumSales } from "@/data/sales";

export function WeeklyChart({ sales }: { sales: Sale[] }) {
  const { t } = useI18n();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      label: t.weekdays[(date.getDay() + 6) % 7],
    };
  });
  const totals = days.map(({ key }) =>
    sumSales(
      sales.filter((sale) => {
        const date = new Date(sale.createdAt);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` === key;
      }),
      (sale) => sale.total,
    ),
  );
  const peak = Math.max(...totals, 0);
  const bars: ChartBar[] = totals.map((total) => ({
    height: peak === 0 ? "0%" : `${Math.max(4, (total / peak) * 92)}%`,
    top: total > 0 && total === peak,
  }));
  const weekTotal = sumSales(
    sales.filter((sale) => new Date(sale.createdAt) >= weekStart),
    (sale) => sale.total,
  );

  return (
    <div className="bg-surface rounded-lg p-[22px] shadow-md">
      <div className="flex justify-between items-center mb-[16px] gap-[10px] flex-wrap">
        <div>
          <h3 className="text-[16px] font-bold mb-[2px] text-ink">
            {t.home.chart.title}
          </h3>
          <div className="text-ink-2 text-[13px]">{t.home.chart.subtitle}</div>
        </div>
        <span className="inline-block text-[12px] font-extrabold px-[11px] py-[2px] rounded-full bg-primary-soft text-primary-dark whitespace-nowrap">
          {weekTotal.toLocaleString("en-US")} RWF
        </span>
      </div>
      <BarChart bars={bars} days={days.map((day) => day.label)} />
    </div>
  );
}
