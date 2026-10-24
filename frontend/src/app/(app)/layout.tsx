import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

/**
 * Shell for the signed-in dashboard pages: sidebar + topbar around the page.
 * Lives in a route group so the auth pages (login / register) can render
 * full-screen without the app chrome, while keeping the same URLs.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
