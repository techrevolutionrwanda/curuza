import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { HomeView } from "@/components/home/HomeView";
import { HomeSkeleton } from "@/components/skeletons/home-skeleton";
import { listProducts } from "../stock/_lib/repository";
import { listSales } from "../_lib/sales";
import { getAccountProfile } from "../settings/_lib/account";

export const metadata: Metadata = {
  title: "Home",
};

async function HomeData() {
  await connection();
  const [products, sales, profile] = await Promise.all([
    listProducts(),
    listSales(),
    getAccountProfile(),
  ]);
  return <HomeView products={products} sales={sales} username={profile.username} />;
}

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeData />
    </Suspense>
  );
}
