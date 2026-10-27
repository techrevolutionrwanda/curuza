"use client";

import { BarChart, type ChartBar } from "@/components/BarChart";
import { useI18n } from "@/i18n/locale-provider";

/** Height of each bar of the week. The day of each bar comes from the dictionary. */
const HEIGHTS: ChartBar[] = [
  { height: "40%" },
  { height: "55%" },
  { height: "35%" },
  { height: "70%" },
  { height: "50%" },
  { height: "92%", top: true },
  { height: "65%" },
];

export function WeeklyChart() {
  const { t } = useI18n();

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
          +12%
        </span>
      </div>
      <BarChart bars={HEIGHTS} days={t.weekdays} />
    </div>
  );
}
