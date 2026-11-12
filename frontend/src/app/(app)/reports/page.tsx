import type { Metadata } from "next";
import { Suspense } from "react";
import { ReportsView } from "@/components/reports/reports-view";
import { ReportsSkeleton } from "@/components/skeletons/reports-skeleton";
import { connection } from "next/server";
import { listSales } from "../_lib/sales";
import { listCategories } from "../stock/_lib/repository";

export const metadata: Metadata = {
  title: "Reports",
};

async function ReportsData() {
  await connection();
  const [sales, categories] = await Promise.all([listSales(), listCategories()]);
  return <ReportsView sales={sales} categories={categories} />;
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsSkeleton />}>
      <ReportsData />
    </Suspense>
  );
}
