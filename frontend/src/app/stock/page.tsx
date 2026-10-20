import { Suspense } from "react";
import { connection } from "next/server";
import { StockView } from "@/components/stock/stock-view";
import { listCategories, listProducts } from "./_lib/repository";

async function StockData() {
  await connection();
  return <StockView products={listProducts()} categories={listCategories()} />;
}

function StockFallback() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-24 pt-5 sm:px-8 sm:pb-[60px] sm:pt-7">
      <div className="mb-[22px] h-[34px] w-[220px] animate-pulse rounded-panel bg-line" />
      <div className="h-[420px] animate-pulse rounded-card bg-surface" />
    </main>
  );
}

export default function StockPage() {
  return (
    <Suspense fallback={<StockFallback />}>
      <StockData />
    </Suspense>
  );
}
