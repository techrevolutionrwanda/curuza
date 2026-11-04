import { Suspense } from "react";
import { connection } from "next/server";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { stockStatus } from "@/data/products";
import { listProducts } from "./stock/_lib/repository";

async function SidebarData() {
  await connection();
  const products = await listProducts();
  const lowStockCount = products.filter(
    (product) => stockStatus(product.qty) !== "ok",
  ).length;

  return <Sidebar lowStockCount={lowStockCount} />;
}

/**
 * Shell for the signed-in dashboard pages: sidebar + topbar around the page.
 * Lives in a route group so the auth pages (login / register) can render
 * full-screen without the app chrome, while keeping the same URLs.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="app">
      <Suspense fallback={<Sidebar lowStockCount={0} />}>
        <SidebarData />
      </Suspense>
      <div className="main">
        <Topbar />
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
