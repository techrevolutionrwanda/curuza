"use client";

import { useState } from "react";

const REVENUE_BARS = [
  { h: "40%" },
  { h: "55%" },
  { h: "35%" },
  { h: "70%" },
  { h: "50%" },
  { h: "92%", top: true },
  { h: "65%" },
];

const DAYS = ["Mbe", "Kab", "Gat", "Gnd", "Gat", "Ruh", "Cyu"];

const PERIODS = ["Uyu munsi", "Icyumweru", "Ukwezi", "Hitamo"];

const SUMMARY_KPIS = [
  { label: "Ibyagurishijwe · Sales", value: "612,000", trend: "up" },
  { label: "Yakiriwe · Cash collected", value: "427,000", trend: "up" },
  { label: "Ku ideni · Credit given", value: "185,000", trend: "down" },
  { label: "Igiciro cy'ibicuruzwa · Cost of goods", value: "351,200" },
  { label: "Ibindi bikoreshwa · Expenses", value: "46,500" },
];

const TOP_CATEGORIES = [
  { name: "Ibinyobwa", percent: 90, count: "214 pcs" },
  { name: "Ibiribwa", percent: 70, count: "167 pcs" },
  { name: "Isuku", percent: 37, count: "89 pcs" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState(0);

  return (
    <div className="w-full">
      <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em]">
            Raporo
          </h1>
          <p className="mt-1 text-ink-2">Reports · understand your business</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className="inline-flex gap-1 rounded-[14px] bg-[#e7edea] p-1"
            role="group"
            aria-label="Period"
          >
            {PERIODS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setPeriod(i)}
                aria-pressed={period === i}
                className={`h-[38px] rounded-[11px] px-4 text-[13px] font-bold transition ${
                  period === i
                    ? "bg-surface text-primary-dark shadow-card"
                    : "text-ink-2 hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-panel border-[1.5px] border-line bg-surface px-5 font-bold transition hover:bg-bg"
          >
            Sohora · Export
          </button>
        </div>
      </div>

      <div className="mb-[16px] grid grid-cols-1 gap-[16px] lg:grid-cols-2">
        {/* Estimated profit */}
        <div className="rounded-card bg-surface p-[22px] shadow-card">
          <div className="mb-[16px] flex flex-wrap items-center justify-between gap-2.5">
            <div>
              <h3 className="text-[16px] font-bold text-ink">
                Inyungu yagereranijwe
              </h3>
              <div className="mt-0.5 text-[13px] text-ink-2">Estimated profit</div>
            </div>
            <span className="inline-block whitespace-nowrap rounded-pill bg-primary-soft px-[11px] py-1 text-[12px] font-extrabold text-primary-dark">
              +12%
            </span>
          </div>
          <div className="mt-4 text-[34px] font-extrabold leading-none tracking-[-0.02em] text-success tabular-nums">
            214,300{" "}
            <small className="text-[15px] font-semibold text-ink-2">RWF</small>
          </div>
          <div className="flex h-[170px] items-end gap-[14px] pt-[10px]">
            {REVENUE_BARS.map((bar, i) => (
              <div
                key={i}
                className="group flex h-full flex-1 flex-col items-center justify-end gap-2 text-[12px] text-ink-2"
              >
                <i
                  className={`block w-full max-w-[56px] rounded-[10px_10px_4px_4px] transition-colors group-hover:bg-primary ${
                    bar.top ? "bg-primary" : "bg-primary-soft"
                  }`}
                  style={{ height: bar.h }}
                  aria-hidden="true"
                />
                {DAYS[i]}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-card bg-surface p-[22px] shadow-card">
          <h3 className="mb-2 text-[16px] font-bold text-ink">Incamake · Summary</h3>
          <div className="divide-y divide-line">
            {SUMMARY_KPIS.map((kpi, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 py-[13px]"
              >
                <span className="text-ink-2">{kpi.label}</span>
                <b
                  className={`tabular-nums ${
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
          <div className="mt-4 rounded-[14px] bg-info-soft px-4 py-3 text-[13px] text-[#17497F]">
            Ideni si amafaranga yinjiye. Inyungu ni igereranya rishingiye ku
            biciro wanditse.
          </div>
        </div>
      </div>

      {/* Top categories */}
      <div className="rounded-card bg-surface p-[22px] shadow-card">
        <h3 className="mb-2 text-[16px] font-bold text-ink">
          Ibyaguzwe cyane · Top categories
        </h3>
        <div className="divide-y divide-line">
          {TOP_CATEGORIES.map((cat, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 py-[13px]"
            >
              <span className="text-ink-2">{cat.name}</span>
              <div className="mx-5 flex-1">
                <div className="h-2 overflow-hidden rounded-pill bg-line">
                  <div
                    className="block h-full rounded-pill bg-primary"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
              <b className="tabular-nums">{cat.count}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
