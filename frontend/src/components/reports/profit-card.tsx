"use client";

import { useI18n } from "@/i18n/locale-provider";
import { BarChart, type ChartBar } from "@/components/BarChart";
import type { Sale } from "@/data/sales";

export function ProfitCard({ sales, total }: { sales: Sale[]; total: number }) {
  const { t } = useI18n();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + index);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      label: t.weekdays[(date.getDay() + 6) % 7],
    };
  });
  const totals = days.map(({ key }) =>
    sales.reduce((sum, sale) => {
      const date = new Date(sale.createdAt);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` === key
        ? sum + sale.total
        : sum;
    }, 0),
  );
  const peak = Math.max(...totals, 0);
  const bars: ChartBar[] = totals.map((amount) => ({
    height: peak === 0 ? "0%" : `${Math.max(4, (amount / peak) * 92)}%`,
    top: amount > 0 && amount === peak,
  }));

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
        <span className="inline-block whitespace-nowrap rounded-pill bg-primary-soft px-3 py-[6px] text-[13px] font-extrabold text-primary-dark">
          {t.reports.profit.transactions.replace("{count}", String(sales.length))}
        </span>
      </div>

      <div className="relative z-[1] mt-4 text-[clamp(30px,3vw,38px)] font-extrabold leading-[1.15] tracking-[-0.04em] text-success tabular-nums">
        {total.toLocaleString("en-US")}{" "}
        <small className="ml-1 text-[14px] font-semibold tracking-normal text-ink-2">
          RWF
        </small>
      </div>

      <div
        role="img"
        aria-label={t.reports.profit.chartLabel}
        className="relative z-[1] mt-3 h-[190px] bg-[repeating-linear-gradient(to_top,transparent_0,transparent_44px,rgba(16,32,27,0.055)_45px,transparent_46px)]"
      >
        <BarChart
          bars={bars}
          days={days.map((day) => day.label)}
          height={190}
          variant="gradient"
          gap="gap-[14px] max-[520px]:gap-2"
        />
      </div>
    </section>
  );
}
