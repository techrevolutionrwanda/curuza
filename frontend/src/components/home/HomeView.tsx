"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { SegmentControl } from "./SegmentControl";
import { PromoBanner } from "./PromoBanner";
import { KpiRow } from "./KpiRow";
import { WeeklyChart } from "./WeeklyChart";
import { RestockList } from "./RestockList";
import { DebtorsTable } from "./DebtorsTable";
import { SaleModal } from "./SaleModal";

export function HomeView({ products }: { products: Product[] }) {
  const [segment, setSegment] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-end gap-4 mb-[22px] flex-wrap">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-ink">
            Muraho, Mukamana 👋
          </h1>
          <p className="mt-[4px] text-base text-ink-2">
            Uko ubucuruzi bwawe buhagaze uyu munsi · Your business today
          </p>
        </div>
        <SegmentControl value={segment} onChange={setSegment} />
      </div>

      <PromoBanner onReba={() => setOpen(true)} />

      <KpiRow products={products} />

      <div className="home-cols grid grid-cols-[2fr_1fr] gap-[16px] mb-[16px]">
        <WeeklyChart />
        <RestockList products={products} />
      </div>

      <DebtorsTable />

      <SaleModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
