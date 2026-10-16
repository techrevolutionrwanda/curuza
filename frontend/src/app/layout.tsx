import type { Metadata } from "next";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import "./globals.css"
export const metadata: Metadata = {
  title: "Smart Ledger",
  description: "Dashboard for the Smart Ledger shops",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-bg font-inter">
        <div className="app">
          <Sidebar />
          <div className="main">
            <Topbar />
            <main className="page">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
