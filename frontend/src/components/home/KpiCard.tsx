"use client";

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  variant?: "hero" | "default";
  iconColor?: "green" | "red" | "yellow" | "white";
  trendColor?: "hero" | "up" | "down";
}

export function KpiCard({
  icon,
  label,
  value,
  unit,
  trend,
  variant = "default",
  iconColor = "green",
  trendColor,
}: KpiCardProps) {
  const isHero = variant === "hero";

  const iconBg = isHero
    ? "bg-white/18 text-white"
    : iconColor === "red"
    ? "bg-danger-soft text-danger"
    : iconColor === "yellow"
    ? "bg-warning-soft text-warning"
    : "bg-primary-soft text-primary";

  const trendClass = isHero
    ? "text-[#B8F0D6]"
    : trendColor === "down"
    ? "text-danger"
    : trendColor === "up"
    ? "text-success"
    : "text-ink-2";

  return (
    <div
      className={`kpi bg-surface rounded-lg p-[20px] shadow-md ${
        isHero
          ? "bg-gradient-to-br from-primary to-primary-dark text-white"
          : ""
      }`}
    >
      <div className="flex items-center gap-2 text-[13px]">
        <div
          className={`grid h-[30px] w-[30px] rounded-sm place-items-center ${iconBg}`}
        >
          {icon}
        </div>
        <span className={isHero ? "text-white/85" : "text-ink-2"}>
          {label}
        </span>
      </div>
      <div className="text-[28px] font-extrabold mt-[10px] mb-[4px] tracking-[-0.02em]">
        {value} {unit && <small className={`text-[13px] font-semibold ${isHero ? "text-white/85" : "text-ink-2"}`}>{unit}</small>}
      </div>
      {trend ? <div className={`text-[12px] font-bold ${trendClass}`}>{trend}</div> : null}
    </div>
  );
}
