"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/data/products";
import type { Sale } from "@/data/sales";
import { SegmentControl } from "@/components/SegmentControl";
import { useI18n } from "@/i18n/locale-provider";
import { KpiRow } from "./KpiRow";
import { WeeklyChart } from "./WeeklyChart";
import { RestockList } from "./RestockList";
import { DebtorsTable } from "./DebtorsTable";
import { SaleModal } from "./SaleModal";

export function HomeView({
  products,
  sales,
  username,
}: {
  products: Product[];
  sales: Sale[];
  username: string;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [segment, setSegment] = useState(0);
  const open = searchParams.get("newSale") === "1";

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-end gap-4 mb-[22px] flex-wrap">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-ink">
            {t.home.greeting}, {username}
          </h1>
          <p className="mt-[4px] text-base text-ink-2">
            {t.home.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/home?newSale=1")}
          className="inline-flex min-h-12 items-center justify-center rounded-panel bg-primary px-5 font-bold text-white transition hover:bg-primary-dark"
        >
          + {t.topbar.newSale}
        </button>
        <SegmentControl
          options={t.home.segments}
          value={segment}
          onChange={setSegment}
          ariaLabel={t.home.periodLabel}
        />
      </div>

      <KpiRow products={products} sales={sales} period={segment} />

      <div className="home-cols grid grid-cols-[2fr_1fr] gap-[16px] mb-[16px]">
        <WeeklyChart sales={sales} />
        <RestockList products={products} />
      </div>

      <DebtorsTable
        sales={sales.filter((sale) => sale.owed > 0).slice(0, 5)}
      />

      {open && (
        <SaleModal
          open
          products={products}
          onClose={() => router.replace("/home")}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}
