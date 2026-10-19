"use client";

const ITEMS = [
  { name: "Amazi 1.5L", badge: "6 bisigaye", variant: "low" },
  { name: "Fanta 300ml", badge: "9 bisigaye", variant: "low" },
  { name: "Ifu y'ibigori 2kg", badge: "Byashize", variant: "out" },
  { name: "Amavuta 1L", badge: "4 bisigaye", variant: "low" },
];

const badgeStyles: Record<string, string> = {
  low: "bg-warning-soft text-warning",
  out: "bg-danger-soft text-danger",
};

export function RestockList() {
  return (
    <div className="bg-surface rounded-lg p-[22px] shadow-md">
      <div className="flex justify-between items-center mb-[16px] gap-[10px] flex-wrap">
        <div>
          <h3 className="text-[16px] font-bold mb-[2px] text-ink">
            Biri hafi gushira
          </h3>
          <div className="text-ink-2 text-[13px]">Needs restocking</div>
        </div>
        <button className="h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center">
          Byose
        </button>
      </div>
      {ITEMS.map((item, i) => (
        <div
          key={i}
          className={`flex justify-between pt-[13px] pb-[13px] border-b border-line ${
            i === ITEMS.length - 1 ? "" : ""
          }`}
        >
          <span className="text-ink-2">{item.name}</span>
          <span
            className={`inline-block text-[12px] font-extrabold px-[11px] py-[2px] rounded-full whitespace-nowrap ${badgeStyles[item.variant]}`}
          >
            {item.badge}
          </span>
        </div>
      ))}
    </div>
  );
}
