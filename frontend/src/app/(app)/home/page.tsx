import { Suspense } from "react";
import { connection } from "next/server";
import { HomeView } from "@/components/home/HomeView";
import { listProducts } from "../stock/_lib/repository";

async function HomeData() {
  await connection();
  return <HomeView products={listProducts()} />;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="h-[34px] w-[260px] animate-pulse rounded-panel bg-line" />
      }
    >
      <HomeData />
    </Suspense>
  );
}
