import { Suspense } from "react";
import { DebtorsView } from "@/components/debtors/debtors-view";
import { connection } from "next/server";
import { listSales } from "../_lib/sales";

async function DebtorsData() {
  await connection();
  const sales = await listSales();
  return <DebtorsView sales={sales} />;
}

export default function DebtorsPage() {
  return (
    <Suspense fallback={<div className="h-[420px] animate-pulse rounded-card bg-surface" />}>
      <DebtorsData />
    </Suspense>
  );
}
