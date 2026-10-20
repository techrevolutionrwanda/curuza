"use client";

import { useI18n } from "@/i18n/locale-provider";
import { BarChart, type ChartBar } from "@/components/BarChart";

const BARS: ChartBar[] = [
  { height: "40%" },
  { height: "55%" },
  { height: "35%" },
  { height: "70%" },
  { height: "50%" },
  { height: "92%", top: true },
  { height: "65%" },
];

/** The estimated profit of the shop, with the profit of each day. */
export function ProfitCard() {
  const { t } = useI18n();

  return (
    <div className="rounded-card bg-surface p-[22px] shadow-card">
      <div className="mb-[16px] flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <h3 className="text-[16px] font-bold text-ink">{t.reports.profit.title}</h3>
          <div className="mt-0.5 text-[13px] text-ink-2">
            {t.reports.profit.subtitle}
          </div>
        </div>
        <span className="inline-block whitespace-nowrap rounded-pill bg-primary-soft px-[11px] py-1 text-[12px] font-extrabold text-primary-dark">
          {t.reports.profit.trend}
        </span>
      </div>

      <div className="mt-4 text-[34px] font-extrabold leading-none tracking-[-0.02em] text-success tabular-nums">
        214,300{" "}
        <small className="text-[15px] font-semibold text-ink-2">RWF</small>
      </div>

      <BarChart bars={BARS} days={t.weekdays} height={170} />
    </div>
  );
}
