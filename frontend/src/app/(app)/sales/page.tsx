import { Suspense } from "react";
import { connection } from "next/server";
import { SalesView } from "@/components/sales/sales-view";
import { listSales } from "../_lib/sales";
import { listProducts } from "../stock/_lib/repository";

async function SalesData() {
  await connection();
  const [sales, products] = await Promise.all([listSales(), listProducts()]);
  return <SalesView sales={sales} products={products} />;
}

export default function SalesPage() {
  return (
    <Suspense fallback={<div className="h-[420px] animate-pulse rounded-card bg-surface" />}>
      <SalesData />
    </Suspense>
  );
}