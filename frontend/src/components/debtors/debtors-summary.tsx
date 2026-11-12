"use client";

import { formatMoney } from "@/data/debtors";
import { useI18n } from "@/i18n/locale-provider";

/**
 * The three numbers that summarise the debtors of the shop:
 * what is owed, how many customers and what was repaid this month.
 */
export function DebtorsSummary({
  totalOwed,
  customerCount,
  totalPaid,
}: {
  totalOwed: number;
  customerCount: number;
  totalPaid: number;
}) {
  const { t } = useI18n();

  const card =
    "flex min-h-[100px] items-center gap-3 rounded-[22px] border border-line bg-surface px-5 py-4 shadow-[0_1px_2px_rgba(16,32,27,.06),0_4px_12px_rgba(16,32,27,.04)]";
  const value =
    "mt-0.5 text-[25px] font-extrabold leading-tight tracking-[-0.02em] text-ink num";

  return (
    <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <section className={card}>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8 8h8M8 12h5M8 16h3" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[13px] text-ink-2">{t.debtors.summary.total}</p>
          <p className={value}>
            {formatMoney(totalOwed)} <span className="text-base">RWF</span>
          </p>
        </div>
      </section>

      <section className={card}>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-success text-white">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M20 8v6M23 11h-6" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[13px] text-ink-2">{t.debtors.summary.customers}</p>
          <p className={value}>{customerCount}</p>
        </div>
      </section>

      <section className={`${card} sm:col-span-2 lg:col-span-1`}>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-warning">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2v4l7 4-7 4v-4L5 6l7-4Z" />
            <path d="M5 14v4l7 4 7-4v-4" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[13px] text-ink-2">{t.debtors.summary.repaid}</p>
          <p className={`${value} text-success`}>
            {formatMoney(totalPaid)} <span className="text-base">RWF</span>
          </p>
        </div>
      </section>
    </div>
  );
}
