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

      <div className="mb-[16px] grid grid-cols-1 gap-[16px] lg:grid-cols-2">
        <ProfitCard />
        <SummaryCard />
      </div>

      <TopCategoriesCard />
    </div>
  );
}
