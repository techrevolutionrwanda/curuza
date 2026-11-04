"use client";

import { BarChart, type ChartBar } from "@/components/BarChart";
import { interpolate } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/locale-provider";
import { filterSalesByPeriod, sumSales, type Sale } from "@/data/sales";

type ChartBin = {
  label: string;
  matches: (date: Date) => boolean;
};

export function WeeklyChart({
  sales,
  period,
}: {
  sales: Sale[];
  period: number;
}) {
  const { t } = useI18n();
  const now = new Date();
  const periodSales = filterSalesByPeriod(sales, period, now);

  const bins: ChartBin[] =
    period === 0
      ? Array.from({ length: 8 }, (_, index) => ({
          label: `${String(index * 3).padStart(2, "0")}:00`,
          matches: (date: Date) => Math.floor(date.getHours() / 3) === index,
        }))
      : period === 1
        ? (() => {
            const monday = new Date(now);
            monday.setHours(0, 0, 0, 0);
            monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
            return Array.from({ length: 7 }, (_, index) => {
              const date = new Date(monday);
              date.setDate(date.getDate() + index);
              const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
              return {
                label: t.weekdays[index],
                matches: (saleDate: Date) =>
                  `${saleDate.getFullYear()}-${saleDate.getMonth()}-${saleDate.getDate()}` === key,
              };
            });
          })()
        : Array.from(
            {
              length: Math.ceil(
                new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() / 7,
              ),
            },
            (_, index) => ({
              label: interpolate(t.home.chart.weekBucket, {
                number: String(index + 1),
              }),
              matches: (date: Date) =>
                Math.floor((date.getDate() - 1) / 7) === index,
            }),
          );

  const totals = bins.map(({ matches }) =>
    sumSales(
      periodSales.filter((sale) => matches(new Date(sale.createdAt))),
      (sale) => sale.total,
    ),
  );
  const peak = Math.max(...totals, 0);
  const bars: ChartBar[] = totals.map((total) => ({
    height: peak === 0 ? "0%" : `${Math.max(4, (total / peak) * 92)}%`,
    top: total > 0 && total === peak,
  }));
  const total = sumSales(periodSales, (sale) => sale.total);

  return (
    <div className="bg-surface rounded-lg p-[22px] shadow-md">
      <div className="flex justify-between items-center mb-[16px] gap-[10px] flex-wrap">
        <div>
          <h3 className="text-[16px] font-bold mb-[2px] text-ink">
            {t.home.chart.titles[period]}
          </h3>
          <div className="text-ink-2 text-[13px]">
            {t.home.chart.subtitles[period]}
          </div>
        </div>
        <span className="inline-block text-[12px] font-extrabold px-[11px] py-[2px] rounded-full bg-primary-soft text-primary-dark whitespace-nowrap">
          {total.toLocaleString("en-US")} RWF
        </span>
      </div>
      <BarChart bars={bars} days={bins.map((bin) => bin.label)} />
    </div>
  );
}
