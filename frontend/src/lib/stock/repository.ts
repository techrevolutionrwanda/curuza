import "server-only";

import type { Locale } from "@/i18n/dictionaries";
import { SEED_CATEGORIES, SEED_PRODUCTS, initialsFor, slugify, type Category, type Product, stockStatus } from "@/data/products";

export { stockStatus };

export type { Category, Product };

type State = {
  categories: Category[];
  products: Product[];
};

const state: State = {
  categories: SEED_CATEGORIES.map((c) => ({ id: c.id, label: { rw: c.label.rw, en: c.label.en } })),
  products: SEED_PRODUCTS.map((p) => ({ ...p })),
};

export function listCategories(): Category[] {
  return state.categories.slice();
}

export function listProducts(): Product[] {
  return state.products.slice();
}

export function getProduct(id: string): Product | undefined {
  return state.products.find((p) => p.id === id);
}

export function categoryLabel(id: string, locale: Locale): string {
  const c = state.categories.find((cat) => cat.id === id);
  if (c) return c.label[locale] ?? c.label.rw ?? id;
  return id;
}

export function createProduct(input: {
  name: string;
  category: string;
  price: number;
  qty: number;
}): Product {
  const trimmed = input.name.trim();
  if (!trimmed) throw new Error("required:name");
  if (!Number.isFinite(input.price) || input.price < 0) throw new Error("invalid:price");
  if (!Number.isFinite(input.qty) || input.qty < 0 || !Number.isInteger(input.qty)) throw new Error("invalid:qty");
  const p: Product = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: trimmed,
    initials: initialsFor(trimmed),
    category: input.category,
    price: Math.trunc(input.price),
    qty: Math.trunc(input.qty),
  };
  state.products.unshift(p);
  return p;
}

export function updateProduct(
  id: string,
  input: { name: string; category: string; price: number; qty: number },
): Product {
  const p = state.products.find((x) => x.id === id);
  if (!p) throw new Error("not-found");
  const trimmed = input.name.trim();
  if (!trimmed) throw new Error("required:name");
  if (!Number.isFinite(input.price) || input.price < 0) throw new Error("invalid:price");
  if (!Number.isFinite(input.qty) || input.qty < 0 || !Number.isInteger(input.qty)) throw new Error("invalid:qty");
  p.name = trimmed;
  p.initials = initialsFor(trimmed);
  p.category = input.category;
  p.price = Math.trunc(input.price);
  p.qty = Math.trunc(input.qty);
  return p;
}

export function deleteProduct(id: string): void {
  const idx = state.products.findIndex((x) => x.id === id);
  if (idx < 0) throw new Error("not-found");
  state.products.splice(idx, 1);
}

export function restockProduct(id: string, amount: number): Product {
  const p = state.products.find((x) => x.id === id);
  if (!p) throw new Error("not-found");
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount)) throw new Error("invalid:amount");
  p.qty = p.qty + amount;
  return p;
}

export function createCategory(input: { nameRw: string; nameEn: string }): Category {
  const rw = input.nameRw.trim();
  const en = input.nameEn.trim();
  if (!rw) throw new Error("required:nameRw");
  if (!en) throw new Error("required:nameEn");
  const id = slugify(rw) || slugify(en);
  if (state.categories.some((c) => c.id === id)) throw new Error("duplicate:id");
  const c: Category = { id, label: { rw, en } };
  state.categories.push(c);
  return c;
}
