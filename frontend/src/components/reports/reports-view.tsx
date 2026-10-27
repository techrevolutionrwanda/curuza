"use client";

import { useState } from "react";
import { ProfitCard } from "./profit-card";
import { ReportsHead } from "./reports-head";
import { SummaryCard } from "./summary-card";
import { TopCategoriesCard } from "./top-categories-card";

/**
 * The reports page.
 *
 * The layout follows the `#reports` section of
 * templates/smart-ledger-web.html: a page head, then the profit and the
 * summary side by side, then the top categories.
 */
export function ReportsView() {
  const [period, setPeriod] = useState(0);

  return (
    <div className="w-full">
      <ReportsHead period={period} onPeriodChange={setPeriod} />

      <div className="mb-[18px] grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:gap-[18px]">
        <ProfitCard />
        <SummaryCard />
      </div>

      <TopCategoriesCard />
    </div>
  );
}
