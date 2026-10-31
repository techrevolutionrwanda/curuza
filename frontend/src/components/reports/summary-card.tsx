"use client";

import { useI18n } from "@/i18n/locale-provider";

export function SummaryCard({
  sales,
  collected,
  owed,
}: {
  sales: number;
  collected: number;
  owed: number;
}) {
  const { t } = useI18n();
  const rows = [
    { key: "sales", value: sales },
    { key: "cash", value: collected },
    { key: "credit", value: owed },
  ] as const;

  return (
    <section
      aria-labelledby="summary-heading"
      className="rounded-card bg-surface p-[22px] shadow-card max-[520px]:p-[18px]"
    >
      <h3 id="summary-heading" className="mb-2 text-[16px] font-bold text-ink">
        {t.reports.summary.title}
      </h3>

      <div className="divide-y divide-line">
        {rows.map((kpi) => (
          <div
            key={kpi.key}
            className="flex items-center justify-between gap-4 py-[14px] text-[14px]"
          >
            <span className="leading-[1.4] text-ink-2">
              {t.reports.summary.rows[kpi.key]}
            </span>
            <b className="whitespace-nowrap tabular-nums text-ink">
              {kpi.value.toLocaleString("en-US")} RWF
            </b>
          </div>
        ))}
      </div>

      <div className="mt-[14px] rounded-[14px] bg-info-soft px-4 py-3 text-[13px] leading-[1.5] text-[#17497F]">
        {t.reports.summary.note}
      </div>
    </section>
  );
}
