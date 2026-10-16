import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import { DEFAULT_LOCALE, dictionaries } from "@/i18n/dictionaries";
import { StockView } from "@/components/stock/stock-view";

const t = dictionaries[DEFAULT_LOCALE].stock;

export const metadata: Metadata = {
  title: `${t.title} · Smart Ledger`,
  description: t.subtitle,
};

export default function StockPage() {
  return <StockView initialProducts={PRODUCTS} />;
}
