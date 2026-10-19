"use client";

const BARS = [
  { label: "Mbe", h: "40%" },
  { label: "Kab", h: "55%" },
  { label: "Gat", h: "35%" },
  { label: "Gnd", h: "70%" },
  { label: "Gat", h: "50%" },
  { label: "Ruh", h: "92%", top: true },
  { label: "Cyu", h: "65%" },
];

export function WeeklyChart() {
  return (
    <div className="bg-surface rounded-lg p-[22px] shadow-md">
      <div className="flex justify-between items-center mb-[16px] gap-[10px] flex-wrap">
        <div>
          <h3 className="text-[16px] font-bold mb-[2px] text-ink">
            Ibyagurishijwe mu cyumweru
          </h3>
          <div className="text-ink-2 text-[13px]">Sales this week · RWF</div>
        </div>
        <span className="inline-block text-[12px] font-extrabold px-[11px] py-[2px] rounded-full bg-primary-soft text-primary-dark whitespace-nowrap">
          +12%
        </span>
      </div>
      <div className="flex items-end gap-[14px] h-[220px] pt-[10px]">
        {BARS.map((b, i) => (
          <div
            key={i}
            className="flex-1 h-full flex flex-col justify-end items-center gap-[8px] text-[12px] text-ink-2 group"
          >
            <i
              className={`w-full max-w-[56px] rounded-[10px_10px_4px_4px] transition-colors group-hover:bg-primary ${
                b.top ? "bg-primary" : "bg-primary-soft"
              }`}
              style={{ height: b.h }}
              aria-hidden="true"
            />
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
}
