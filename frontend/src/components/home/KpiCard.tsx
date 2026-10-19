"use client";

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  variant?: "hero" | "default";
}

export function KpiCard({
  icon,
  label,
  value,
  trend,
  variant = "default",
}: KpiCardProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={`bg-surface rounded-lg p-[20px] shadow-md ${
        isHero
          ? "bg-gradient-to-br from-primary to-primary-dark text-white"
          : ""
      }`}
    >
      <div className="flex items-center gap-2 text-[13px]">
        <div
          className={`grid h-[30px] w-[30px] rounded-sm place-items-center ${
            isHero ? "bg-white/18 text-white" : "bg-primary-soft text-primary"
          }`}
        >
          {icon}
        </div>
        <span className={isHero ? "text-white/85" : "text-ink-2"}>
          {label}
        </span>
      </div>
      <div className="text-[28px] font-extrabold mt-[10px] mb-[4px] tracking-[-0.02em]">
        {value}
      </div>
      <div
        className={`text-[12px] font-bold ${
          isHero ? "text-[#B8F0D6]" : "text-success"
        }`}
      >
        {trend}
      </div>
    </div>
  );
}
