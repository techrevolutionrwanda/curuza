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

export const SEED_CATEGORIES: Category[] = [
  {
    id: "ibinyobwa",
    label: { rw: "Ibinyobwa", en: "Drinks" },
  },
  {
    id: "ibiribwa",
    label: { rw: "Ibiribwa", en: "Food" },
  },
  {
    id: "isuku",
    label: { rw: "Isuku", en: "Cleaning" },
  },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: "isukari-1kg",
    name: "Isukari 1kg",
    initials: initialsFor("Isukari 1kg"),
    category: "ibiribwa",
    price: 1800,
    qty: 42,
  },
  {
    id: "amazi-1-5l",
    name: "Amazi 1.5L",
    initials: initialsFor("Amazi 1.5L"),
    category: "ibinyobwa",
    price: 700,
    qty: 6,
  },
  {
    id: "ifu-yibigori-2kg",
    name: "Ifu y'ibigori 2kg",
    initials: initialsFor("Ifu y'ibigori 2kg"),
    category: "ibiribwa",
    price: 2400,
    qty: 0,
  },
  {
    id: "savoni",
    name: "Savoni",
    initials: initialsFor("Savoni"),
    category: "isuku",
    price: 500,
    qty: 58,
  },
  {
    id: "fanta-300ml",
    name: "Fanta 300ml",
    initials: initialsFor("Fanta 300ml"),
    category: "ibinyobwa",
    price: 500,
    qty: 9,
  },
];
