import { Suspense, type ReactNode } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { countLowStock } from "@/data/products";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/dictionaries";
import { LocaleProvider } from "@/i18n/locale-provider";
import { listProducts } from "./stock/_lib/repository";

async function SidebarData() {
  await connection();
  const products = await listProducts();
  const lowStockCount = countLowStock(products);

  return <Sidebar lowStockCount={lowStockCount} />;
}

async function AppShell({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const locale: Locale =
    cookieStore.get("locale")?.value === "en" ? "en" : DEFAULT_LOCALE;

  return (
    <LocaleProvider initialLocale={locale}>
      <div className="app">
        <Suspense fallback={<Sidebar lowStockCount={0} />}>
          <SidebarData />
        </Suspense>
        <div className="main">
          <Topbar />
          <main className="page">{children}</main>
        </div>
      </div>
    </LocaleProvider>
  );
}

function AppFallback() {
  return (
    <div className="app">
      <Sidebar lowStockCount={0} />
      <div className="main">
        <Topbar />
        <main className="page" />
      </div>
    </div>
  );
}

/**
 * Shell for the signed-in dashboard pages: sidebar + topbar around the page.
 * Lives in a route group so the auth pages (login / register) can render
 * full-screen without the app chrome, while keeping the same URLs.
 *
 * The locale cookie is read on the server so the language rendered in the
 * streamed shell matches the one the browser hydrates with.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={<AppFallback />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
