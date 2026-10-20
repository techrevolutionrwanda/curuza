"use client";

import { interpolate } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/locale-provider";

const TOP_CATEGORIES = [
  { id: "ibinyobwa", percent: 90, count: 214 },
  { id: "ibiribwa", percent: 70, count: 167 },
  { id: "isuku", percent: 37, count: 89 },
] as const;

/** The categories that sold the most. */
export function TopCategoriesCard() {
  const { t } = useI18n();

  return (
    <div className="rounded-card bg-surface p-[22px] shadow-card">
      <h3 className="mb-2 text-[16px] font-bold text-ink">
        {t.reports.categories.title}
      </h3>

      <div className="divide-y divide-line">
        {TOP_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between gap-4 py-[13px]"
          >
            <span className="text-ink-2">{t.stock.categories[cat.id]}</span>
            <div className="mx-5 flex-1">
              <div className="h-2 overflow-hidden rounded-pill bg-line">
                <div
                  className="block h-full rounded-pill bg-primary"
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
            <b className="tabular-nums">
              {interpolate(t.reports.categories.units, { count: String(cat.count) })}
            </b>
          </div>
        ))}
      </div>
    </div>
  );
}
