import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { SalesView } from "@/components/sales/sales-view";
import { SalesSkeleton } from "@/components/skeletons/sales-skeleton";
import { listSales } from "../_lib/sales";
import { listProducts } from "../stock/_lib/repository";

export const metadata: Metadata = {
  title: "Sales",
};

async function SalesData() {
  await connection();
  const [sales, products] = await Promise.all([listSales(), listProducts()]);
  return <SalesView sales={sales} products={products} />;
}

export default function SalesPage() {
  return (
    <Suspense fallback={<SalesSkeleton />}>
      <SalesData />
    </Suspense>
  );
}