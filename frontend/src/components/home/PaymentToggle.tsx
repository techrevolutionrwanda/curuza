"use client";

import { useI18n } from "@/i18n/locale-provider";

interface PaymentToggleProps {
  value: string;
  onChange: (value: string) => void;
}

const METHODS = [
  { key: "cash", labelKey: "cash" },
  { key: "partial", labelKey: "partial" },
  { key: "credit", labelKey: "credit" },
] as const;

export function PaymentToggle({ value, onChange }: PaymentToggleProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-3 gap-[8px] mb-[14px] mt-[14px]">
      {METHODS.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={() => onChange(p.key)}
          className={`min-h-[58px] rounded-[14px] border border-line border-[1.5px] font-bold text-[14px] flex flex-col items-center justify-center gap-[2px] ${
            value === p.key
              ? "border-primary bg-primary-soft text-primary-dark"
              : "text-ink"
          }`}
        >
          {t.home.sale.payment[p.labelKey].label}
          <span className="text-[12px] text-ink-2 font-normal">
            {t.home.sale.payment[p.labelKey].sub}
          </span>
        </button>
      ))}
    </div>
  );
}
