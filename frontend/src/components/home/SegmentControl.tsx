"use client";

import { useState } from "react";

const SEGMENTS = [
  { value: 0, label: "Uyu munsi" },
  { value: 1, label: "Icyumweru" },
  { value: 2, label: "Ukwezi" },
];

interface SegmentControlProps {
  value: number;
  onChange: (value: number) => void;
}

export function SegmentControl({ value, onChange }: SegmentControlProps) {
  return (
    <div className="inline-flex bg-[#e7edea] rounded-[14px] p-1 gap-1">
      {SEGMENTS.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => onChange(s.value)}
          className={`h-[38px] px-4 rounded-[11px] font-bold text-[13px] ${
            value === s.value
              ? "bg-surface text-primary-dark shadow-md"
              : "text-ink-2"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
