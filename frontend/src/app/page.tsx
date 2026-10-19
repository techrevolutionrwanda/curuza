"use client";

import { useState } from "react";
import { SegmentControl } from "../components/home/SegmentControl";
import { PromoBanner } from "../components/home/PromoBanner";
import { KpiRow } from "../components/home/KpiRow";
import { WeeklyChart } from "../components/home/WeeklyChart";
import { RestockList } from "../components/home/RestockList";
import { DebtorsTable } from "../components/home/DebtorsTable";
import { SaleModal } from "../components/home/SaleModal";

export default function Home() {
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

      <KpiRow />

      <div className="home-cols grid grid-cols-[2fr_1fr] gap-[16px] mb-[16px]">
        <WeeklyChart />
        <RestockList />
      </div>

      <DebtorsTable />

      <SaleModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
