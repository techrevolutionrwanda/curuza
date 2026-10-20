"use client";

import { useI18n } from "@/i18n/locale-provider";

interface SegmentControlProps {
  value: number;
  onChange: (value: number) => void;
}

export function SegmentControl({ value, onChange }: SegmentControlProps) {
  const { t } = useI18n();

  return (
    <div className="inline-flex bg-[#e7edea] rounded-[14px] p-1 gap-1">
      {t.home.segments.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(i)}
          aria-pressed={value === i}
          className={`h-[38px] px-4 rounded-[11px] font-bold text-[13px] ${
            value === i
              ? "bg-surface text-primary-dark shadow-md"
              : "text-ink-2"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
