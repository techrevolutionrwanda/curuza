"use client";

import { useI18n } from "@/i18n/locale-provider";

const SUMMARY_KPIS = [
  { key: "sales", value: "612,000", trend: "up" },
  { key: "cash", value: "427,000", trend: "up" },
  { key: "credit", value: "185,000", trend: "down" },
  { key: "cost", value: "351,200", trend: "" },
  { key: "expenses", value: "46,500", trend: "" },
] as const;

/** How the shop did: what came in, what went out and what is left. */
export function SummaryCard() {
  const { t } = useI18n();

  return (
    <section
      aria-labelledby="summary-heading"
      className="rounded-card bg-surface p-[22px] shadow-card max-[520px]:p-[18px]"
    >
      <h3 id="summary-heading" className="mb-2 text-[16px] font-bold text-ink">
        {t.reports.summary.title}
      </h3>

      <div className="divide-y divide-line">
        {SUMMARY_KPIS.map((kpi) => (
          <div
            key={kpi.key}
            className="flex items-center justify-between gap-4 py-[14px] text-[14px]"
          >
            <span className="leading-[1.4] text-ink-2">
              {t.reports.summary.rows[kpi.key]}
            </span>
            <b
              className={`whitespace-nowrap tabular-nums ${
                kpi.trend === "up"
                  ? "text-success"
                  : kpi.trend === "down"
                  ? "text-danger"
                  : "text-ink"
              }`}
            >
              {kpi.value}
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
