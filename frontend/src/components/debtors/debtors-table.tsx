"use client";

import { formatMoney, type Debtor } from "@/data/debtors";
import { interpolate } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/locale-provider";

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { timeZone: "Africa/Kigali" });
}

/** The table of the customers that owe the shop money. */
export function DebtorsTable({
  debtors,
  isLoading,
  onOpen,
  onPay,
  onRemind,
}: {
  debtors: Debtor[];
  isLoading: boolean;
  onOpen: (debtor: Debtor) => void;
  onPay: (debtor: Debtor) => void;
  onRemind: (debtor: Debtor) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_1px_2px_rgba(16,32,27,.06),0_6px_20px_rgba(16,32,27,.05)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="bg-[#FAFCFB] text-[12px] uppercase tracking-[0.06em] text-ink-2">
              <th className="border-b border-line px-4 py-3 text-left font-bold">
                {t.debtors.columns.customer}
              </th>
              <th className="border-b border-line px-4 py-3 text-left font-bold">
                {t.debtors.columns.phone}
              </th>
              <th className="border-b border-line px-4 py-3 text-right font-bold">
                {t.debtors.columns.total}
              </th>
              <th className="border-b border-line px-4 py-3 text-left font-bold">
                {t.debtors.columns.repaid}
              </th>
              <th className="border-b border-line px-4 py-3 text-right font-bold">
                {t.debtors.columns.owed}
              </th>
              <th className="border-b border-line px-4 py-3 text-left font-bold">
                <span className="sr-only">{t.debtors.columns.actions}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {debtors.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-2">
                  {t.debtors.empty}
                </td>
              </tr>
            )}
            {debtors.map((debtor) => {
              const paidPercent =
                debtor.total > 0
                  ? Math.min(100, Math.round((debtor.paid / debtor.total) * 100))
                  : 0;

              return (
                <tr
                  key={debtor.id}
                  tabIndex={0}
                  aria-label={interpolate(t.common.viewDetails, { name: debtor.name })}
                  onClick={() => onOpen(debtor)}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onOpen(debtor);
                    }
                  }}
                  className="cursor-pointer border-b border-line last:border-b-0 hover:bg-[#FAFCFB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[12px] bg-primary-soft font-extrabold text-primary-dark">
                        {debtor.initial}
                      </div>
                      <div>
                        <b className="block text-sm font-bold text-ink">{debtor.name}</b>
                        <span className="text-xs text-ink-2">
                          {debtor.dueDate
                            ? `${t.debtors.dueDate} ${shortDate(debtor.dueDate)}`
                            : shortDate(debtor.date)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle text-sm text-ink num">{debtor.phone}</td>
                  <td className="px-4 py-3 text-right align-middle">
                    <b className="text-sm font-bold text-ink num">{formatMoney(debtor.total)}</b>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex min-w-[100px] items-center gap-2">
                      <div
                        className="h-2 flex-1 overflow-hidden rounded-full bg-line"
                        role="progressbar"
                        aria-label={interpolate(t.debtors.progressLabel, {
                          name: debtor.name,
                        })}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={paidPercent}
                      >
                        <div
                          className="h-full rounded-full bg-primary transition-[width]"
                          style={{ width: `${paidPercent}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-[11px] font-semibold text-ink-2">
                        {paidPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right align-middle">
                    <b
                      className={`text-sm font-bold num ${
                        debtor.owed > 0 ? "text-danger" : "text-success"
                      }`}
                    >
                      {formatMoney(debtor.owed)}
                    </b>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex min-w-[248px] gap-2">
                      <button
                        type="button"
                        className="inline-flex h-[38px] flex-1 items-center justify-center rounded-[11px] bg-primary px-3 text-[12px] font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={(event) => {
                          event.stopPropagation();
                          onPay(debtor);
                        }}
                        disabled={isLoading || debtor.owed <= 0}
                      >
                        {isLoading ? t.debtors.paying : t.debtors.pay}
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-[38px] flex-1 items-center justify-center rounded-[11px] border border-line bg-surface px-3 text-[12px] font-bold text-primary-dark transition-colors hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={(event) => {
                          event.stopPropagation();
                          onRemind(debtor);
                        }}
                        disabled={isLoading || debtor.owed <= 0 || !debtor.phone}
                      >
                        {t.debtors.reminder.send}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
