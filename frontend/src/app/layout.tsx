import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LocaleProvider } from "../i18n/locale-provider";
import "./globals.css";

// Inter, self-hosted by Next.js instead of the Google Fonts <link>
// the HTML templates use. The variable exposes the stack as
// --font-inter, which the font-inter utility already reads.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Curuza",
    template: "Curuza - %s",
  },
  description:
    "Curuza helps you track your stock, sales and customer debts in one simple place.",
  applicationName: "Curuza",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${inter.variable} flex min-h-full flex-col bg-bg font-inter`}
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
