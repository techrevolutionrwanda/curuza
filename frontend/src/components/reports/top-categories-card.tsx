"use client";

import { interpolate } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/locale-provider";

export function TopCategoriesCard({
  categories,
}: {
  categories: Array<{ id: string; name: string; count: number }>;
}) {
  const { t } = useI18n();
  const maximum = Math.max(...categories.map((category) => category.count), 0);

  return (
    <section
      aria-labelledby="categories-heading"
      className="rounded-card bg-surface p-[22px] shadow-card max-[520px]:p-[18px]"
    >
      <h3 id="categories-heading" className="text-[17px] font-bold text-ink">
        {t.reports.categories.title}
      </h3>
      <div className="mt-[3px] text-[13px] text-ink-2">
        {t.reports.categories.subtitle}
      </div>

      <div className="divide-y divide-line">
        {categories.map((cat) => {
          const percent = maximum > 0 ? Math.round((cat.count / maximum) * 100) : 0;
          return (
            <div
              key={cat.id}
              className="flex items-center justify-between gap-[18px] py-4 max-[520px]:gap-2.5 max-[520px]:py-3.5"
            >
              <span className="min-w-[110px] font-semibold text-ink max-[520px]:min-w-[82px] max-[520px]:text-[13px]">
                {cat.name}
              </span>
              <div
                role="progressbar"
                aria-label={interpolate(t.reports.categories.rowLabel, { name: cat.name })}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                className="flex-1"
              >
                <div className="h-[10px] overflow-hidden rounded-pill bg-[#EDF1EF]">
                  <div
                    className="block h-full rounded-pill bg-[linear-gradient(90deg,#72BDA4,var(--color-primary))]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
              <b className="min-w-[76px] whitespace-nowrap text-right tabular-nums max-[520px]:min-w-[64px] max-[520px]:text-[13px]">
                {interpolate(t.reports.categories.units, { count: String(cat.count) })}
              </b>
            </div>
          );
        })}
        {categories.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-2">{t.reports.categories.empty}</p>
        )}
      </div>
    </section>
  );
}
