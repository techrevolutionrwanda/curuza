"use client";

import { useI18n } from "@/i18n/locale-provider";
import { BarChart, type ChartBar } from "@/components/BarChart";
import { SegmentControl } from "@/components/SegmentControl";
import type { Sale } from "@/data/sales";

export function ProfitCard({
  sales,
  total,
  period,
  chartType,
  onChartTypeChange,
}: {
  sales: Sale[];
  total: number;
  period: number;
  chartType: number;
  onChartTypeChange: (chartType: number) => void;
}) {
  const { t } = useI18n();
  const today = new Date();
  const bins = period === 0
    ? Array.from({ length: 8 }, (_, index) => ({
        label: `${String(index * 3).padStart(2, "0")}:00`,
        matches: (date: Date) => Math.floor(date.getHours() / 3) === index,
      }))
    : period === 1
      ? (() => {
          const monday = new Date(today);
          monday.setHours(0, 0, 0, 0);
          monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
          return Array.from({ length: 7 }, (_, index) => {
            const date = new Date(monday);
            date.setDate(date.getDate() + index);
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            return {
              label: t.weekdays[index],
              matches: (saleDate: Date) =>
                `${saleDate.getFullYear()}-${saleDate.getMonth()}-${saleDate.getDate()}` === key,
            };
          });
        })()
      : Array.from({ length: Math.ceil(new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() / 7) }, (_, index) => ({
          label: t.reports.categories.weekBucket.replace("{number}", String(index + 1)),
          matches: (date: Date) => Math.floor((date.getDate() - 1) / 7) === index,
        }));
  const totals = bins.map(({ matches }) =>
    sales.reduce((sum, sale) => matches(new Date(sale.createdAt)) ? sum + sale.total : sum, 0),
  );
  const peak = Math.max(...totals, 0);
  const bars: ChartBar[] = totals.map((amount) => ({
    height: peak === 0 ? "0%" : `${Math.max(4, (amount / peak) * 92)}%`,
    top: amount > 0 && amount === peak,
  }));
  const chartWidth = 600;
  const chartHeight = 160;
  const points = totals.map((amount, index) => {
    const x = 12 + (index * (chartWidth - 24)) / Math.max(totals.length - 1, 1);
    const y = chartHeight - 12 - (amount / Math.max(peak, 1)) * (chartHeight - 24);
    return { x, y };
  });
  const pointList = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPoints = `${pointList} ${chartWidth - 12},${chartHeight} 12,${chartHeight}`;

  return (
    <section
      aria-labelledby="profit-heading"
      className="relative overflow-hidden rounded-card border border-[rgba(16,32,27,0.04)] bg-[linear-gradient(145deg,#fff_12%,#F1F8F5_100%)] p-[22px] shadow-card max-[520px]:p-[18px]"
    >
      {/* The soft circle of the template, in the corner of the card. */}
      <div className="pointer-events-none absolute -right-[100px] -top-[110px] h-[190px] w-[190px] rounded-full bg-[rgba(14,122,95,0.07)]" />

      <div className="relative z-[1] mb-[10px] flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <h3
            id="profit-heading"
            className="text-[16px] font-bold text-ink"
          >
            {t.reports.profit.title}
          </h3>
          <div className="mt-0.5 text-[13px] text-ink-2">
            {t.reports.profit.subtitle}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="report-chart-controls">
            <SegmentControl
              options={t.reports.chartTypes}
              value={chartType}
              onChange={onChartTypeChange}
              ariaLabel={t.reports.chartTypeLabel}
            />
          </div>
          <span className="inline-block whitespace-nowrap rounded-pill bg-primary-soft px-3 py-[6px] text-[13px] font-extrabold text-primary-dark">
            {t.reports.profit.transactions.replace("{count}", String(sales.length))}
          </span>
        </div>
      </div>

      <div className="relative z-[1] mt-4 text-[clamp(30px,3vw,38px)] font-extrabold leading-[1.15] tracking-[-0.04em] text-success tabular-nums">
        {total.toLocaleString("en-US")}{" "}
        <small className="ml-1 text-[14px] font-semibold tracking-normal text-ink-2">
          RWF
        </small>
      </div>

      {chartType === 0 ? (
        <div
          role="img"
          aria-label={t.reports.profit.chartLabel}
          className="relative z-[1] mt-3 h-[190px] bg-[repeating-linear-gradient(to_top,transparent_0,transparent_44px,rgba(16,32,27,0.055)_45px,transparent_46px)]"
        >
          <BarChart
            bars={bars}
            days={bins.map((bin) => bin.label)}
            height={190}
            variant="gradient"
            gap="gap-[14px] max-[520px]:gap-2"
          />
        </div>
      ) : (
        <div
          role="img"
          aria-label={t.reports.profit.chartLabel}
          className="relative z-[1] mt-3 h-[190px]"
        >
          <svg className="h-[160px] w-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" aria-hidden="true">
            {[0, 1, 2, 3].map((line) => (
              <line key={line} x1="0" x2={chartWidth} y1={line * 48 + 8} y2={line * 48 + 8} stroke="#e2e8e5" strokeDasharray="4 5" />
            ))}
            {chartType === 2 && <polygon points={areaPoints} fill="rgba(14,122,95,0.14)" />}
            <polyline points={pointList} fill="none" stroke="#0e7a5f" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
            {points.map(({ x, y }, index) => (
              <circle key={index} cx={x} cy={y} r="4" fill="#0e7a5f" stroke="white" strokeWidth="2" />
            ))}
          </svg>
          <div className="mt-1 flex justify-between gap-1 text-[10px] text-ink-2">
            {bins.map((bin, index) => <span key={index}>{bin.label}</span>)}
          </div>
        </div>
      )}
    </section>
  );
}
