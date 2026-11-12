import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { StockView } from "@/components/stock/stock-view";
import { StockSkeleton } from "@/components/skeletons/stock-skeleton";
import { listCategories, listProducts } from "./_lib/repository";

export const metadata: Metadata = {
  title: "Stock",
};

async function StockData() {
  await connection();
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  return <StockView products={products} categories={categories} />;
}

export default function StockPage() {
  return (
    <Suspense fallback={<StockSkeleton />}>
      <StockData />
    </Suspense>
  );
}
