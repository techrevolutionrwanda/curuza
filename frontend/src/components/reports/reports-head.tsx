"use client";

import { SegmentControl } from "@/components/SegmentControl";
import { useI18n } from "@/i18n/locale-provider";

/** The head of the reports page: the title, the period and the export button. */
export function ReportsHead({
  period,
  onPeriodChange,
}: {
  period: number;
  onPeriodChange: (period: number) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em]">
          {t.reports.title}
        </h1>
        <p className="mt-1 text-ink-2">{t.reports.subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <SegmentControl
          options={t.reports.periods}
          value={period}
          onChange={onPeriodChange}
          ariaLabel={t.reports.periodLabel}
        />
        <button
          type="button"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-panel border-[1.5px] border-line bg-surface px-5 font-bold transition hover:bg-bg"
        >
          {t.reports.export}
        </button>
      </div>
    </div>
  );
}
