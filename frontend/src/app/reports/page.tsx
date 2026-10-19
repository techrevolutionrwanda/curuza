"use client";

import React from "react";

const REVENUE_BARS = [
  { label: "Mbe", h: "40%", top: true },
  { label: "Kab", h: "55%" },
  { label: "Gat", h: "35%" },
  { label: "Gnd", h: "70%" },
  { label: "Gat", h: "50%" },
  { label: "Ruh", h: "92%" },
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
  return (
    <div className="page reports-page">
      <div class="head">
        <div>
          <h1>Raporo</h1>
          <p>Reports · understand your business</p>
        </div>
        <div className="seg" data-seg>
          <button className="on">Uyu munsi</button>
          <button>Icyumweru</button>
          <button>Ukwezi</button>
          <button>Hitamo</button>
        </div>
        <button className="btn ghost">Sohora · Export</button>
      </div>

      <div className="cols even">
        <div className="card" style={{ marginTop: "16px" }}>
          <h3 style={{ marginBottom: "8px" }}>Incamake · Summary</h3>
          {SUMMARY_KPIS.map((kpi, i) => (
            <div key={i} className="kv">
              <span>{kpi.label}</span>
              <b className={`num ${kpi.trend}`}>{kpi.value}</b>
            </div>
          ))}
          <div className="note">
            Ideni si amafaranga yinjiye. Inyungu ni igereranya rishingiye ku biciro wanditse.
          </div>
        </div>

        <div className="card" style={{ marginTop: "16px" }}>
          <h3 style={{ marginBottom: "8px" }}>Ibyaguzwe cyane · Top categories</h3>
          {TOP_CATEGORIES.map((cat, i) => (
            <div key={i} className="kv">
              <span>{cat.name}</span>
              <div style={{ flex: 1, margin: "6px 20px" }}>
                <div className="bar">
                  <i style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
              <b className="num">{cat.count}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}