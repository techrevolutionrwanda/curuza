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
  variant = "default",
}: {
  options: string[];
  value: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
  /** The reports page uses the wider control of the template. */
  variant?: "default" | "report";
}) {
  const report = variant === "report";

  return (
    <div
      className={[
        "inline-flex gap-1 p-1",
        report
          ? "max-sm:flex-1 max-sm:justify-between rounded-[15px] bg-[#E9EFEC] max-[520px]:gap-0.5 max-[520px]:p-[3px]"
          : "rounded-[14px] bg-[#e7edea]",
      ].join(" ")}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(i)}
          aria-pressed={value === i}
          className={[
            "h-[38px] whitespace-nowrap rounded-[11px] text-[13px] font-bold transition",
            report ? "px-2 max-sm:flex-1 max-sm:px-2.5 max-[520px]:px-1 max-[520px]:text-[11px]" : "px-2 sm:px-4",
            value === i
              ? "bg-surface text-primary-dark shadow-card"
              : "text-ink-2 hover:text-ink",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
