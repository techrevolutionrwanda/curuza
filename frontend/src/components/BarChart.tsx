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

type ChartVariant = {
  /** Background of a normal bar, and what it turns into on hover. */
  bar: string;
  /** Background of the best bar of the week. */
  top: string;
  /** Width of a bar. */
  width: string;
  /** Radius of a bar. */
  radius: string;
  /** Size of the day label. */
  label: string;
  /** Gap between a bar and its label. */
  gap: string;
};

const VARIANTS: Record<"default" | "gradient", ChartVariant> = {
  default: {
    bar: "bg-primary-soft group-hover:bg-primary",
    top: "bg-primary",
    width: "max-w-[56px]",
    radius: "rounded-[10px_10px_4px_4px]",
    label: "text-[12px]",
    gap: "gap-2",
  },
  gradient: {
    bar: "bg-[linear-gradient(180deg,#A9D9C8,var(--color-primary-soft))] group-hover:bg-[linear-gradient(180deg,#26A17A,var(--color-primary))]",
    top: "bg-[linear-gradient(180deg,#26A17A,var(--color-primary))]",
    width: "max-w-[44px]",
    radius: "rounded-[9px_9px_4px_4px]",
    label: "text-[11px]",
    gap: "gap-[9px]",
  },
};

export function BarChart({
  bars,
  days,
  height = 220,
  variant = "default",
  gap = "gap-[14px]",
}: {
  bars: ChartBar[];
  days: string[];
  height?: number;
  variant?: "default" | "gradient";
  /** Gap between two bars. */
  gap?: string;
}) {
  const v = VARIANTS[variant];

  return (
    <div className={`flex items-end ${gap} pt-[10px]`} style={{ height }}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`group flex h-full flex-1 flex-col items-center justify-end ${v.gap} ${v.label} text-ink-2`}
        >
          <i
            className={`block w-full ${v.width} ${v.radius} transition-colors ${
              bar.top ? v.top : v.bar
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
