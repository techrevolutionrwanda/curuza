"use client";

import { useMemo, useState } from "react";
import { formatMoney, SAMPLE_DEBTORS, type Debtor } from "@/data/debtors";
import { interpolate } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/locale-provider";
import { DebtorsSummary } from "./debtors-summary";
import { DebtorsTable } from "./debtors-table";

/**
 * The debtors page: the customers that owe the shop money, how much they
 * owe and what they already paid.
 */
export function DebtorsView() {
  const { t } = useI18n();
  const [debtors, setDebtors] = useState<Debtor[]>(SAMPLE_DEBTORS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  const totalPaid = filtered.reduce((sum, debtor) => sum + debtor.paid, 0);

  const handlePayment = async (debtorId: string, amount: number) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDebtors((current) =>
        current.map((debtor) => {
          if (debtor.id !== debtorId) return debtor;
          const paid = Math.min(debtor.total, debtor.paid + amount);
          return { ...debtor, paid, owed: debtor.total - paid };
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openPaymentModal = (debtorId: string, currentOwed: number) => {
    if (currentOwed <= 0) {
      alert(t.debtors.alerts.nothingOwed);
      return;
    }

    const raw = prompt(
      interpolate(t.debtors.alerts.amountPrompt, {
        amount: formatMoney(currentOwed),
      }),
    );
    if (raw === null || raw.trim() === "") return;

    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount <= 0 || amount > currentOwed) {
      alert(
        interpolate(t.debtors.alerts.amountInvalid, {
          amount: formatMoney(currentOwed),
        }),
      );
      return;
    }

    void handlePayment(debtorId, amount);
  };

  const sendReminder = (debtor: Debtor) => {
    alert(interpolate(t.debtors.alerts.smsReminder, { name: debtor.name }));
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
        customerCount={filtered.length}
        totalPaid={totalPaid}
      />

      <DebtorsTable
        debtors={filtered}
        isLoading={isLoading}
        onSendReminder={sendReminder}
        onPay={(debtor) => openPaymentModal(debtor.id, debtor.owed)}
      />
    </div>
  );
}
