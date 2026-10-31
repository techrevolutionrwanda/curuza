"use client";

import { SegmentControl } from "@/components/SegmentControl";
import { useI18n } from "@/i18n/locale-provider";

/** The head of the reports page: the title, the period and the export button. */
export function ReportsHead({
  period,
  onPeriodChange,
  onExcelExport,
  onPdfExport,
}: {
  period: number;
  onPeriodChange: (period: number) => void;
  onExcelExport: () => void | Promise<void>;
  onPdfExport: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="mb-[26px] flex flex-wrap items-center justify-between gap-4 max-sm:items-start">
      <div>
        <h1 className="text-[32px] font-bold leading-[1.15] tracking-[-0.02em] max-[520px]:text-[28px]">
          {t.reports.title}
        </h1>
        <p className="mt-1 text-[14px] text-ink-2">{t.reports.subtitle}</p>
        <p className="reports-print-period mt-1 hidden text-sm text-ink-2">
          {t.reports.periodLabel}: {t.reports.periods[period]}
        </p>
      </div>

      <div className="reports-actions flex flex-wrap items-center gap-2.5 max-sm:w-full">
        <SegmentControl
          options={t.reports.periods}
          value={period}
          onChange={onPeriodChange}
          ariaLabel={t.reports.periodLabel}
          variant="report"
        />
        <button
          type="button"
          onClick={onExcelExport}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-panel border-[1.5px] border-line bg-surface px-[18px] font-bold transition hover:bg-bg max-[520px]:w-full"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M8 13l3 5m0-5-3 5m7-5-3 5m0-5 3 5" />
          </svg>
          {t.reports.excel}
        </button>
        <button
          type="button"
          onClick={onPdfExport}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-panel bg-primary px-[18px] font-bold text-white transition hover:bg-primary-dark max-[520px]:w-full"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <path d="M6 14h12v8H6z" />
          </svg>
          {t.reports.pdf}
        </button>
      </div>
    </div>
  );
}
