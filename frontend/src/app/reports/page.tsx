"use client";

import { useState } from "react";

const REVENUE_BARS = [
  { label: "Mbe", h: "40%" },
  { label: "Kab", h: "55%" },
  { label: "Gat", h: "35%" },
  { label: "Gnd", h: "70%" },
  { label: "Gat", h: "50%" },
  { label: "Ruh", h: "92%", top: true },
  { label: "Cyu", h: "65%" },
];

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
  const [selectedRange, setSelectedRange] = useState("Uyu munsi");
  const ranges = ["Uyu munsi", "Icyumweru", "Ukwezi", "Hitamo"];

  return (
    <div className="page reports-page">
      <div className="head report-head">
        <div>
          <h1>Raporo</h1>
          <p>Reports · understand your business</p>
        </div>
        <div className="report-controls">
          <div className="seg report-range" role="group" aria-label="Hitamo igihe cya raporo">
            {ranges.map((range) => (
              <button
                key={range}
                type="button"
                className={selectedRange === range ? "on" : undefined}
                aria-pressed={selectedRange === range}
                onClick={() => setSelectedRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="btn ghost report-export">Sohora · Export</button>
        </div>
      </div>

      <div className="cols report-grid">
        <section className="card report-card report-profit" aria-labelledby="profit-heading">
          <div className="ch">
            <div>
              <h3 id="profit-heading">Inyungu yagereranijwe</h3>
              <div className="sub">Estimated profit</div>
            </div>
            <span className="badge ok">+12%</span>
          </div>
          <div className="report-value num up">
            214,300 <small>RWF</small>
          </div>
          <div
            className="chart report-chart"
            role="img"
            aria-label="Estimated profit by day for the last seven days"
          >
            {REVENUE_BARS.map((b, i) => (
              <div
                key={i}
                className={b.top ? "top" : undefined}
              >
                <i style={{ height: b.h }} aria-hidden="true" />
                {b.label}
              </div>
            ))}
          </div>
        </section>

        <section className="card report-card report-summary" aria-labelledby="summary-heading">
          <h3 id="summary-heading">Incamake · Summary</h3>
          {SUMMARY_KPIS.map((kpi, i) => (
            <div key={i} className="kv">
              <span>{kpi.label}</span>
              <b className={`num ${kpi.trend}`}>{kpi.value}</b>
            </div>
          ))}
          <div className="note">
            Ideni si amafaranga yinjiye. Inyungu ni igereranya rishingiye ku biciro wanditse.
          </div>
        </section>
      </div>

      <section className="card report-card report-categories" aria-labelledby="categories-heading">
        <h3 id="categories-heading">Ibyaguzwe cyane · Top categories</h3>
        <div className="sub">Sales volume by product category</div>
        {TOP_CATEGORIES.map((cat, i) => (
          <div key={i} className="kv report-category-row">
            <span>{cat.name}</span>
            <div
              className="category-bar"
              role="progressbar"
              aria-label={`${cat.name} sales volume`}
              aria-valuenow={cat.percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <i style={{ width: `${cat.percent}%` }} />
            </div>
            <b className="num">{cat.count}</b>
          </div>
        ))}
      </section>
    </div>
  );
}
