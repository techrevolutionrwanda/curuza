import type { Locale } from "@/i18n/dictionaries";

export type Category = {
  id: string;
  label: Record<Locale, string>;
};

export type Product = {
  id: string;
  name: string;
  initials: string;
  category: string;
  price: number;
  qty: number;
};

export type StockStatus = "ok" | "low" | "out";

export function stockStatus(qty: number): StockStatus {
  if (qty <= 0) return "out";
  if (qty <= 10) return "low";
  return "ok";
}

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "item";
}
