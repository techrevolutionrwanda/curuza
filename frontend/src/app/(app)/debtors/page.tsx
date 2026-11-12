import type { Metadata } from "next";
import { Suspense } from "react";
import { DebtorsView } from "@/components/debtors/debtors-view";
import { DebtorsSkeleton } from "@/components/skeletons/debtors-skeleton";
import { connection } from "next/server";
import { listSales } from "../_lib/sales";

export const metadata: Metadata = {
  title: "Debtors",
};

async function DebtorsData() {
  await connection();
  const sales = await listSales();
  return <DebtorsView sales={sales} />;
}

export default function DebtorsPage() {
  return (
    <Suspense fallback={<DebtorsSkeleton />}>
      <DebtorsData />
    </Suspense>
  );
}
