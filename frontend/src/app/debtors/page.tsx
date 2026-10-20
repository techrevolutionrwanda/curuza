"use client";

import React, { useMemo, useState } from "react";

interface Debtor {
  id: string;
  name: string;
  initial: string;
  phone: string;
  date: string;
  total: number;
  paid: number;
  owed: number;
}

const sampleDebtors: Debtor[] = [
  {
    id: "1",
    name: "Jean Marie",
    initial: "JM",
    phone: "078•••4521",
    date: "18 Ukw 2026",
    total: 64000,
    paid: 19000,
    owed: 45000,
  },
  {
    id: "2",
    name: "Chantal Uwase",
    initial: "CU",
    phone: "072•••9034",
    date: "02 Ukw 2026",
    total: 50000,
    paid: 37500,
    owed: 12500,
  },
  {
    id: "3",
    name: "Eric Nkurunziza",
    initial: "EN",
    phone: "079•••1180",
    date: "24 Nzi 2026",
    total: 30000,
    paid: 3000,
    owed: 27000,
  },
];

const formatMoney = (amount: number) => amount.toLocaleString("en-US");

export default function DebtorsPage() {
  const [debtors, setDebtors] = useState<Debtor[]>(sampleDebtors);
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
      alert("Uyu mukiriya nta deni asigaje.");
      return;
    }

    const raw = prompt(
      `Amafaranga yishyuwe (asigaye ${formatMoney(currentOwed)} RWF):`,
    );
    if (raw === null || raw.trim() === "") return;

    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount <= 0 || amount > currentOwed) {
      alert(`Andika amafaranga hagati ya 1 na ${formatMoney(currentOwed)} RWF.`);
      return;
    }

    void handlePayment(debtorId, amount);
  };

  const sendReminder = (debtor: Debtor) => {
    alert(`Kwibutsa ${debtor.name} kuri SMS bizaboneka igihe SMS izaba ihujwe.`);
  };

  return (
    <div className="page mx-auto w-full max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-ink">
          Amadeni
        </h1>
        <p className="mt-1 text-sm text-ink-2">
          Abafitanye ideni · Who owes what
        </p>
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
          <span className="sr-only">Shakisha umukiriya</span>
          <input
            type="search"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
            placeholder="Shakisha umukiriya..."
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
          />
        </label>
      </div>

      {/* Summary cards */}
      <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <section className="flex min-h-[100px] items-center gap-3 rounded-[22px] border border-line bg-surface px-5 py-4 shadow-[0_1px_2px_rgba(16,32,27,.06),0_4px_12px_rgba(16,32,27,.04)]">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M8 8h8M8 12h5M8 16h3" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] text-ink-2">Yose hamwe · Total owed</p>
            <p className="mt-0.5 text-[25px] font-extrabold leading-tight tracking-[-0.02em] text-ink num">
              {formatMoney(totalOwed)} <span className="text-base">RWF</span>
            </p>
          </div>
        </section>

        <section className="flex min-h-[100px] items-center gap-3 rounded-[22px] border border-line bg-surface px-5 py-4 shadow-[0_1px_2px_rgba(16,32,27,.06),0_4px_12px_rgba(16,32,27,.04)]">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-success text-white">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] text-ink-2">Abakiriya · Customers</p>
            <p className="mt-0.5 text-[25px] font-extrabold leading-tight tracking-[-0.02em] text-ink num">
              {filtered.length}
            </p>
          </div>
        </section>

        <section className="flex min-h-[100px] items-center gap-3 rounded-[22px] border border-line bg-surface px-5 py-4 shadow-[0_1px_2px_rgba(16,32,27,.06),0_4px_12px_rgba(16,32,27,.04)] sm:col-span-2 xl:col-span-1">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-warning">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2v4l7 4-7 4v-4L5 6l7-4Z" />
              <path d="M5 14v4l7 4 7-4v-4" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] text-ink-2">Yishyuwe uku kwezi · Repaid this month</p>
            <p className="mt-0.5 text-[25px] font-extrabold leading-tight tracking-[-0.02em] text-success num">
              {formatMoney(totalPaid)} <span className="text-base">RWF</span>
            </p>
          </div>
        </section>
      </div>

      {/* Debtors table */}
      <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_1px_2px_rgba(16,32,27,.06),0_6px_20px_rgba(16,32,27,.05)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="bg-[#FAFCFB] text-[12px] uppercase tracking-[0.06em] text-ink-2">
                <th className="border-b border-line px-4 py-3 text-left font-bold">Umukiriya</th>
                <th className="border-b border-line px-4 py-3 text-left font-bold">Telefoni</th>
                <th className="border-b border-line px-4 py-3 text-right font-bold">Yose</th>
                <th className="border-b border-line px-4 py-3 text-left font-bold">Yishyuwe</th>
                <th className="border-b border-line px-4 py-3 text-right font-bold">Asigaye</th>
                <th className="border-b border-line px-4 py-3 text-left font-bold"><span className="sr-only">Ibikorwa</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-2">
                    Nta mukiriya uhuye n'ibyo washakishije.
                  </td>
                </tr>
              )}
              {filtered.map((debtor) => {
                const paidPercent =
                  debtor.total > 0
                    ? Math.min(100, Math.round((debtor.paid / debtor.total) * 100))
                    : 0;

                return (
                  <tr key={debtor.id} className="border-b border-line last:border-b-0 hover:bg-[#FAFCFB]">
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[12px] bg-primary-soft font-extrabold text-primary-dark">
                          {debtor.initial}
                        </div>
                        <div>
                          <b className="block text-sm font-bold text-ink">{debtor.name}</b>
                          <span className="text-xs text-ink-2">{debtor.date}</span>
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
                          aria-label={`${debtor.name} repayment progress`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={paidPercent}
                        >
                          <div
                            className="h-full rounded-full bg-primary transition-[width]"
                            style={{ width: `${paidPercent}%` }}
                          />
                        </div>
                        <span className="w-9 text-right text-[11px] font-semibold text-ink-2">{paidPercent}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right align-middle">
                      <b className={`text-sm font-bold num ${debtor.owed > 0 ? "text-danger" : "text-success"}`}>
                        {formatMoney(debtor.owed)}
                      </b>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex min-w-[174px] gap-2">
                        <button
                          type="button"
                          className="inline-flex h-[38px] flex-1 items-center justify-center rounded-[11px] bg-primary-soft px-3 text-[12px] font-bold text-primary-dark transition-colors hover:bg-[#D5EEE5] disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() => sendReminder(debtor)}
                        >
                          SMS
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-[38px] flex-1 items-center justify-center rounded-[11px] bg-primary px-3 text-[12px] font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() => openPaymentModal(debtor.id, debtor.owed)}
                          disabled={isLoading || debtor.owed <= 0}
                        >
                          {isLoading ? "..." : "Kwishyura"}
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
    </div>
  );
}
