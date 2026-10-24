import type { Metadata } from "next";
import { LocaleProvider } from "../i18n/locale-provider";
import "./globals.css";
export const metadata: Metadata = {
  title: "Smart Ledger",
  description: "Dashboard for the Smart Ledger shops",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-bg font-inter">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
