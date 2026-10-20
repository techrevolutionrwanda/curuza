"use client";

import { useI18n } from "@/i18n/locale-provider";

/** Height of each bar of the week. The day of each bar comes from the dictionary. */
const HEIGHTS = ["40%", "55%", "35%", "70%", "50%", "92%", "65%"];

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
      <div className="flex items-end gap-[14px] h-[220px] pt-[10px]">
        {HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="flex-1 h-full flex flex-col justify-end items-center gap-[8px] text-[12px] text-ink-2 group"
          >
            <i
              className={`w-full max-w-[56px] rounded-[10px_10px_4px_4px] transition-colors group-hover:bg-primary ${
                i === 5 ? "bg-primary" : "bg-primary-soft"
              }`}
              style={{ height: h }}
              aria-hidden="true"
            />
            {t.home.chart.days[i]}
          </div>
        ))}
      </div>
    </div>
  );
}
