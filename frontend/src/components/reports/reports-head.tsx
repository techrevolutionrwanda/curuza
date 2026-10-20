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
    <div className="mb-[26px] flex flex-wrap items-center justify-between gap-4 max-sm:items-start">
      <div>
        <h1 className="text-[32px] font-bold leading-[1.15] tracking-[-0.02em] max-[520px]:text-[28px]">
          {t.reports.title}
        </h1>
        <p className="mt-1 text-[14px] text-ink-2">{t.reports.subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 max-sm:w-full">
        <SegmentControl
          options={t.reports.periods}
          value={period}
          onChange={onPeriodChange}
          ariaLabel={t.reports.periodLabel}
          variant="report"
        />
        <button
          type="button"
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-panel border-[1.5px] border-line bg-surface px-[18px] font-bold transition hover:bg-bg max-[520px]:w-full"
        >
          {t.reports.export}
        </button>
      </div>
    </div>
  );
}
