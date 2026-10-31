import { Suspense } from "react";
import { ReportsView } from "@/components/reports/reports-view";
import { connection } from "next/server";
import { listSales } from "../_lib/sales";
import { listCategories } from "../stock/_lib/repository";

async function ReportsData() {
  await connection();
  const [sales, categories] = await Promise.all([listSales(), listCategories()]);
  return <ReportsView sales={sales} categories={categories} />;
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="h-[420px] animate-pulse rounded-card bg-surface" />}>
      <ReportsData />
    </Suspense>
  );
}
