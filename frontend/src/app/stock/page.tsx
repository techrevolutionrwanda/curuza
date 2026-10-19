import { connection } from "next/server";
import type { Metadata } from "next";
import { DEFAULT_LOCALE, dictionaries } from "@/i18n/dictionaries";
import { StockView } from "@/components/stock/stock-view";
import { listCategories, listProducts } from "@/lib/stock/repository";

const t = dictionaries[DEFAULT_LOCALE].stock;

export const metadata: Metadata = {
  title: `${t.title} · Smart Ledger`,
  description: t.subtitle,
};

export default async function StockPage() {
  await connection();
  const products = listProducts();
  const categories = listCategories();
  return <StockView products={products} categories={categories} />;
}
