"use client";

/**
 * A row of bars, one per day of the week.
 *
 * Used by the weekly chart of the home page and by the profit chart of
 * the reports page.
 */
export type ChartBar = {
  /** Height of the bar, as a CSS length. */
  height: string;
  /** The bar is the best one of the week and is painted in the brand colour. */
  top?: boolean;
};

export function BarChart({
  bars,
  days,
  height = 220,
}: {
  bars: ChartBar[];
  days: string[];
  height?: number;
}) {
  return (
    <div className="flex items-end gap-[14px] pt-[10px]" style={{ height }}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className="group flex h-full flex-1 flex-col items-center justify-end gap-2 text-[12px] text-ink-2"
        >
          <i
            className={`block w-full max-w-[56px] rounded-[10px_10px_4px_4px] transition-colors group-hover:bg-primary ${
              bar.top ? "bg-primary" : "bg-primary-soft"
            }`}
            style={{ height: bar.height }}
            aria-hidden="true"
          />
          {days[i]}
        </div>
      ))}
    </div>
  );
}
