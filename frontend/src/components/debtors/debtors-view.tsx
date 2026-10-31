"use client";

import { useMemo, useState, type FormEvent } from "react";
import { formatMoney, saleToDebtor, type Debtor } from "@/data/debtors";
import type { Sale } from "@/data/sales";
import { useI18n } from "@/i18n/locale-provider";
import { recordSalePayment } from "@/lib/sales-api";
import { DebtorsSummary } from "./debtors-summary";
import { DebtorsTable } from "./debtors-table";

/**
 * The debtors page: the customers that owe the shop money, how much they
 * owe and what they already paid.
 */
export function DebtorsView({ sales }: { sales: Sale[] }) {
  const { t } = useI18n();
  const [debtors, setDebtors] = useState(() =>
    sales.filter((sale) => sale.owed > 0).map(saleToDebtor),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDebtor, setPaymentDebtor] = useState<Debtor | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return debtors;

    return debtors.filter(
      (debtor) =>
        debtor.name.toLowerCase().includes(term) ||
        debtor.initial.toLowerCase().includes(term) ||
        debtor.phone.toLowerCase().includes(term),
    );
  }, [debtors, searchTerm]);

  const totalOwed = filtered.reduce((sum, debtor) => sum + debtor.owed, 0);
  const totalPaid = sales.reduce(
    (sum, sale) => sum + (sale.paymentMethod === "cash" ? 0 : sale.paid),
    0,
  );
  const customerCount = new Set(filtered.map((debtor) => debtor.phone)).size;

  const handlePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!paymentDebtor) return;
    const amount = Number(paymentAmount);
    if (!Number.isSafeInteger(amount) || amount <= 0 || amount > paymentDebtor.owed) {
      setPaymentError(t.debtors.alerts.amountInvalid.replace("{amount}", formatMoney(paymentDebtor.owed)));
      return;
    }

    setPaymentError("");
    setIsLoading(true);
    try {
      const updatedSale = await recordSalePayment(paymentDebtor.id, amount);
      setDebtors((current) =>
        current
          .map((debtor) => debtor.id === updatedSale.id ? saleToDebtor(updatedSale) : debtor)
          .filter((debtor) => debtor.owed > 0),
      );
      setPaymentDebtor(null);
    } catch (cause) {
      setPaymentError(cause instanceof Error ? cause.message : t.debtors.paymentError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page mx-auto w-full max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-ink">
          {t.debtors.title}
        </h1>
        <p className="mt-1 text-sm text-ink-2">{t.debtors.subtitle}</p>
      </div>

      {/* Search */}
      <div className="mb-5 flex items-center gap-3">
        <svg
          className="h-5 w-5 shrink-0 text-ink-3"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <label className="flex min-h-[54px] flex-1 items-center rounded-[16px] border border-line bg-surface px-4 transition-colors focus-within:border-primary">
          <span className="sr-only">{t.debtors.searchLabel}</span>
          <input
            type="search"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
            placeholder={t.debtors.search}
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
          />
        </label>
      </div>

      <DebtorsSummary
        totalOwed={totalOwed}
        customerCount={customerCount}
        totalPaid={totalPaid}
      />

      <DebtorsTable
        debtors={filtered}
        isLoading={isLoading}
        onPay={(debtor) => {
          setPaymentDebtor(debtor);
          setPaymentAmount(String(debtor.owed));
          setPaymentError("");
        }}
      />

      {paymentDebtor && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[rgba(16,32,27,0.5)] p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setPaymentDebtor(null);
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-title"
            onSubmit={handlePayment}
            className="w-full max-w-[420px] rounded-card bg-surface p-6 shadow-modal"
          >
            <h2 id="payment-title" className="text-xl font-bold text-ink">{t.debtors.pay}</h2>
            <p className="mt-1 text-sm text-ink-2">{paymentDebtor.name} · {formatMoney(paymentDebtor.owed)} RWF</p>
            <label className="mt-4 block text-sm font-semibold text-ink-2">
              {t.debtors.paymentAmount}
              <input
                autoFocus
                required
                type="number"
                min={1}
                max={paymentDebtor.owed}
                step={1}
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
                className="mt-1 min-h-12 w-full rounded-panel border border-line bg-surface px-3 outline-none focus:border-primary"
              />
            </label>
            {paymentError && <p role="alert" className="mt-2 text-sm font-semibold text-danger">{paymentError}</p>}
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => setPaymentDebtor(null)} className="min-h-12 rounded-panel border border-line px-4 font-bold" disabled={isLoading}>
                {t.common.cancel}
              </button>
              <button type="submit" className="min-h-12 flex-1 rounded-panel bg-primary px-4 font-bold text-white disabled:opacity-60" disabled={isLoading}>
                {isLoading ? t.debtors.paying : t.debtors.pay}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
