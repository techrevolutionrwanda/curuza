"use client";

import React, { useState } from "react";

interface Debtor {
  id: string;
  name: string;
  initial: string;
  phone: string;
  date: string;
  total: number;
  paid: number;
  owed: number;
  repaidPercent: number;
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
    repaidPercent: 30,
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
    repaidPercent: 75,
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
    repaidPercent: 10,
  },
];

export default function DebtorsPage() {
  const [debtors, setDebtors] = useState<Debtor[]>(sampleDebtors);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filtered = debtors.filter(
    (d) =>
      !searchTerm ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.initial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.trim().toLowerCase();
    setSearchTerm(term);
  };

  const handlePayment = async (debtorId: string, amount: number) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDebtors(
        debtors.map((d) =>
          d.id === debtorId
            ? { ...d, paid: d.paid + amount, owed: d.total - (d.paid + amount) }
            : d
        )
      );
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const openPaymentModal = (
    debtorId: string,
    currentOwed: number
  ): void => {
    const raw = prompt(
      `Kwishyura ibiriho kugwa ${currentOwed.toLocaleString(
        "en-US"
      )} RWF. Rwiyere:`
    );
    const amount = raw !== null && raw !== "" ? Number(raw) : NaN;
    if (!isNaN(amount) && amount > 0 && amount <= currentOwed) {
      handlePayment(debtorId, amount);
    } else if (raw !== null && raw !== "" && isNaN(amount)) {
      alert(
        "Ubere rw' ibiriho byinshi. Mbere 0 kugura ibiriho rw' icyo ushobora kugura."
      );
    }
  };

  return (
    <div className="page">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Amadeni</h1>
      <p className="text-ink-2 text-sm mb-6">
        Abafitanye ideni · Who owes what
      </p>

      {/* Search form */}
      <div className="mb-6">
        <label className="flex items-center gap-2">
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
          <input
            type="text"
            className="flex-1 rounded-[14px] border-[1.5px] border-line bg-surface px-[14px] min-h-[46px] outline-none placeholder-text-ink-2"
            placeholder="Shakisha igicuruzwa cyangwa umukiriya…"
            onChange={handleSearch}
            value={searchTerm}
          />
        </label>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v3" />
                <path d="M1 10h4" />
                <path d="M1 15h6" />
                <path d="M14 21h4a2 2 0 0 0 2-2v-3" />
                <path d="M16 5H4l2 6h8l2-6h-5.9" />
              </svg>
            </div>
            <div>
              <p className="text-ink-2 text-sm">Yose hamwe · Total owed</p>
              <p className="text-3xl font-extrabold text-ink num">
                {filtered.reduce(
                  (sum, d) => sum + d.owed,
                  0
                ).toLocaleString("en-US")} RWF</p>
            </div>
          </div>
        </div>

        <div className="card rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-lg bg-success flex items-center justify-center flex-shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--success)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4l10 8-10 8v-4" />
                <path d="M2 6l4 4 7-2-5-3-2 2-7 4 2 2 7-4 5 3 5 3 2-2-7-4z" />
              </svg>
            </div>
            <div>
              <p className="text-ink-2 text-sm">Abakiriya · Customers</p>
              <p className="text-3xl font-extrabold text-ink num">{filtered.length}</p>
            </div>
          </div>
        </div>

        <div className="card rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--warning)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4l10 8-10 8v-4" />
                <path d="M2 6l4 4 7-2-5-3-2 2-7 4 2 2 7-4 5 3 5 3 2-2-7-4z" />
              </svg>
            </div>
            <div>
              <p className="text-ink-2 text-sm">Yishyuwe uku kwezi · Repaid this month</p>
              <p className="text-3xl font-extrabold tracking-tighter text-ink text-success num">
                {filtered.reduce((sum, d) => sum + d.paid, 0)
                  .toLocaleString("en-US")} RWF</p>
            </div>
          </div>
        </div>
      </div>

      {/* Debtors table */}
      <div className="mt-8 overflow-x-auto rounded-lg shadow-sm border">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="text-[12px] uppercase tracking-[0.06em] text-ink-2">
              <th className="text-left px-4 py-3 border-b border-line font-bold">Umukiriya</th>
              <th className="text-left px-4 py-3 border-b border-line font-bold">Telefoni</th>
              <th className="text-right px-4 py-3 border-b border-line font-bold">Yose</th>
              <th className="text-left px-4 py-3 border-b border-line font-bold">Yishyuwe</th>
              <th className="text-right px-4 py-3 border-b border-line font-bold">Asigaye</th>
              <th className="text-left px-4 py-3 border-b border-line font-bold"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-2">
                  No debtors found matching your search.
                </td>
              </tr>
            )}
            {filtered.map((d, i) => (
              <tr
                key={d.id}
                className={`hover:bg-[#fafcfb] ${
                  i === filtered.length - 1 ? "border-b-0" : "border-b border-line"
                }`}
              >
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-[38px] w-[38px] rounded-[11px] bg-primary-soft text-primary-dark grid place-items-center font-extrabold shrink-0"
                    >
                      {d.initial}
                    </div>
                    <div>
                      <b className="block text-ink">{d.name}</b>
                      <span className="text-[11px] text-ink-2">{d.date}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 align-middle">
                  <span className="text-ink num">{d.phone}</span>
                </td>
                <td className="text-right px-4 py-3 align-middle">
                  <b className="text-danger font-nums tracking-[-0.01em]">
                    {d.total.toLocaleString("en-US")}
                  </b>
                </td>
                <td className="px-4 py-3 align-middle">
                  <span className="text-[11px] text-ink-2">{d.date}</span>
                </td>
                <td className="text-right px-4 py-3 align-middle">
                  <b className="text-danger font-nums tracking-[-0.01em]">
                    {d.owed.toLocaleString("en-US")}
                  </b>
                </td>
                <td className="px-4 py-3 align-middle">
                  <div className="flex gap-2">
                    <button
                      className="flex-1 h-[34px] px-3 rounded-[8px] font-bold text-[12px] bg-primary-soft text-primary-dark inline-flex items-center justify-center"
                      onClick={() => openPaymentModal(d.id, d.owed)}
                      disabled={isLoading}
                    >
                      SMS
                    </button>
                    <button
                      className="flex-1 h-[34px] px-3 rounded-[8px] font-bold text-[12px] bg-primary-soft text-primary-dark inline-flex items-center justify-center"
                      onClick={() => openPaymentModal(d.id, d.owed)}
                      disabled={isLoading}
                    >
                      Kwishyura
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}