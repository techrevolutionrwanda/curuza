"use client";

/**
 * A row of buttons where one option is active at a time.
 *
 * Uses the `.seg` control of templates/smart-ledger-web.html. The home
 * page and the reports page both pick a period with it.
 */
export function SegmentControl({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: string[];
  value: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      className="inline-flex gap-1 rounded-[14px] bg-[#e7edea] p-1"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(i)}
          aria-pressed={value === i}
          className={`h-[38px] whitespace-nowrap rounded-[11px] px-2 text-[13px] font-bold transition sm:px-4 ${
            value === i
              ? "bg-surface text-primary-dark shadow-card"
              : "text-ink-2 hover:text-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
