"use client";

import { KpiCard } from "./KpiCard";

const KPIS = [
  {
    variant: "hero" as const,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 17l6-6 4 4 8-8" />
      </svg>
    ),
    label: "Ibyagurishijwe · Sales",
    value: "86,500",
    unit: "RWF",
    trend: "▲ 12% ugereranyije n'ejo",
  },
  {
    variant: "default" as const,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
    label: "Yakiriwe · Cash in",
    value: "61,500",
    unit: "RWF",
    trend: "▲ 7%",
  },
  {
    variant: "default" as const,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
    label: "Amadeni · Owed to you",
    value: "184,000",
    unit: "RWF",
    trend: "12 abakiriya",
  },
  {
    variant: "default" as const,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      </svg>
    ),
    label: "Stock nke · Low stock",
    value: "4",
    unit: "ibicuruzwa",
    trend: "1 byashize",
  },
];

export function KpiRow() {
  return (
    <div className="home-kpis grid grid-cols-4 gap-[16px] mb-[20px]">
      {KPIS.map((kpi, i) => (
        <KpiCard key={i} {...kpi} />
      ))}
    </div>
  );
}
