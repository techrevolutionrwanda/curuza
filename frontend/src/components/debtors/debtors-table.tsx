"use client";

import { formatMoney, type Debtor } from "@/data/debtors";
import { interpolate } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/locale-provider";

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { timeZone: "Africa/Kigali" });
}

function paidPercent(debtor: Debtor): number {
  return debtor.total > 0
    ? Math.min(100, Math.round((debtor.paid / debtor.total) * 100))
    : 0;
}

const actionButton =
  "inline-flex h-10 flex-1 items-center justify-center rounded-[11px] px-3 text-[12px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

/**
 * The pay / remind pair that sits in the table row and in the mobile card.
 * `className` only affects the wrapper, so both layouts share the buttons.
 */
function DebtorActions({
  debtor,
  isLoading,
  onPay,
  onRemind,
  className = "",
}: {
  debtor: Debtor;
  isLoading: boolean;
  onPay: (debtor: Debtor) => void;
  onRemind: (debtor: Debtor) => void;
  className?: string;
}) {
  const { t } = useI18n();
  const disabled = isLoading || debtor.owed <= 0;

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        type="button"
        className={`${actionButton} bg-primary text-white hover:bg-primary-dark`}
        onClick={(event) => {
          event.stopPropagation();
          onPay(debtor);
        }}
        disabled={disabled}
      >
        {isLoading ? t.debtors.paying : t.debtors.pay}
      </button>
      <button
        type="button"
        className={`${actionButton} border border-line bg-surface text-primary-dark hover:bg-primary-soft`}
        onClick={(event) => {
          event.stopPropagation();
          onRemind(debtor);
        }}
        disabled={disabled || !debtor.phone}
      >
        {t.debtors.reminder.send}
      </button>
    </div>
  );
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
    <>
      {/* Wide screens: the full table. */}
      <div className="hidden overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_1px_2px_rgba(16,32,27,.06),0_6px_20px_rgba(16,32,27,.05)] xl:block">
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
                const percent = paidPercent(debtor);

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
                          aria-valuenow={percent}
                        >
                          <div
                            className="h-full rounded-full bg-primary transition-[width]"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-9 text-right text-[11px] font-semibold text-ink-2">
                          {percent}%
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
                      <DebtorActions
                        debtor={debtor}
                        isLoading={isLoading}
                        onPay={onPay}
                        onRemind={onRemind}
                        className="min-w-[240px]"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phones and tablets: one card per debtor, no horizontal scrolling. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:hidden">
        {debtors.length === 0 && (
          <div className="rounded-[18px] border border-line bg-surface px-4 py-10 text-center text-sm text-ink-2 sm:col-span-2">
            {t.debtors.empty}
          </div>
        )}

        {debtors.map((debtor) => {
          const percent = paidPercent(debtor);

          return (
            <article
              key={debtor.id}
              className="flex flex-col rounded-[18px] border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(16,32,27,.06),0_4px_12px_rgba(16,32,27,.04)]"
            >
              <button
                type="button"
                onClick={() => onOpen(debtor)}
                aria-label={interpolate(t.common.viewDetails, { name: debtor.name })}
                className="flex w-full items-start gap-3 rounded-[12px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span
                  aria-hidden="true"
                  className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[12px] bg-primary-soft font-extrabold text-primary-dark"
                >
                  {debtor.initial}
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block truncate text-sm font-bold text-ink">
                    {debtor.name}
                  </b>
                  <span className="mt-0.5 block truncate text-xs text-ink-2 num">
                    {debtor.phone || "—"}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-ink-3">
                    {debtor.dueDate
                      ? `${t.debtors.dueDate} ${shortDate(debtor.dueDate)}`
                      : shortDate(debtor.date)}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.06em] text-ink-3">
                    {t.debtors.columns.owed}
                  </span>
                  <b
                    className={`mt-0.5 block text-sm font-bold num ${
                      debtor.owed > 0 ? "text-danger" : "text-success"
                    }`}
                  >
                    {formatMoney(debtor.owed)}
                  </b>
                </span>
              </button>

              <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-ink-3">
                <span className="truncate">
                  {t.debtors.columns.total}{" "}
                  <b className="font-semibold text-ink-2 num">
                    {formatMoney(debtor.total)}
                  </b>
                </span>
                <span className="shrink-0">
                  {t.debtors.columns.repaid}{" "}
                  <b className="font-semibold text-ink-2 num">{percent}%</b>
                </span>
              </div>

              <div
                className="mt-1.5 h-2 overflow-hidden rounded-full bg-line"
                role="progressbar"
                aria-label={interpolate(t.debtors.progressLabel, {
                  name: debtor.name,
                })}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width]"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <DebtorActions
                debtor={debtor}
                isLoading={isLoading}
                onPay={onPay}
                onRemind={onRemind}
                className="mt-3"
              />
            </article>
          );
        })}
      </div>
    </>
  );
}
