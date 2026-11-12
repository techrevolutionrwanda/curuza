import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";
import { apiBaseUrl } from "@/lib/api-base";
import { stockStatus, type Category, type Product } from "@/data/products";

export { stockStatus };

export type { Category, Product };

const API_BASE_URL = apiBaseUrl();

export class StockApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "StockApiError";
  }
}

function record(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function requiredArray(result: unknown, key: string): unknown[] {
  const data = record(result);
  const value = data?.[key];
  if (!Array.isArray(value)) {
    throw new Error("The server returned invalid stock data.");
  }
  return value;
}

function requiredRecord(result: unknown, key: string): Record<string, unknown> {
  const data = record(result);
  const value = data?.[key];
  const item = record(value);
  if (!item) {
    throw new Error("The server returned invalid stock data.");
  }
  return item;
}

function parseProduct(value: unknown): Product {
  const product = record(value);
  if (
    !product ||
    typeof product.id !== "string" ||
    typeof product.name !== "string" ||
    typeof product.initials !== "string" ||
    typeof product.category !== "string" ||
    typeof product.price !== "number" ||
    !Number.isFinite(product.price) ||
    typeof product.qty !== "number" ||
    !Number.isFinite(product.qty)
  ) {
    throw new Error("The server returned invalid product data.");
  }

  return {
    id: product.id,
    name: product.name,
    initials: product.initials,
    category: product.category,
    price: product.price,
    qty: product.qty,
  };
}

function parseCategory(value: unknown): Category {
  const category = record(value);
  const label = record(category?.label);
  if (
    !category ||
    typeof category.id !== "string" ||
    !label ||
    typeof label.rw !== "string" ||
    typeof label.en !== "string"
  ) {
    throw new Error("The server returned invalid category data.");
  }

  return {
    id: category.id,
    label: {
      rw: label.rw,
      en: label.en,
    },
  };
}

async function request(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<unknown> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionCookie) {
    throw new StockApiError(401, "Your session has expired. Please log in again.");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/stock/${path}`, {
      method: options.method ?? "GET",
      cache: "no-store",
      headers: {
        Cookie: `${SESSION_COOKIE}=${sessionCookie}`,
        ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
    });
  } catch {
    throw new StockApiError(503, "Unable to reach the stock service. Please try again.");
  }

  let result: unknown = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const message = record(result)?.message;
    throw new StockApiError(
      response.status,
      typeof message === "string"
        ? message
        : "Unable to complete your stock request.",
    );
  }

  return result;
}

// The app shell and the page both ask for products during one render. `cache`
// keeps that as one backend request instead of two.
export const listProducts = cache(async (): Promise<Product[]> => {
  try {
    const result = await request("products");
    return requiredArray(result, "products").map(parseProduct);
  } catch {
    return [];
  }
});

export const listCategories = cache(async (): Promise<Category[]> => {
  try {
    const result = await request("categories");
    return requiredArray(result, "categories").map(parseCategory);
  } catch {
    return [];
  }
});

export async function createProduct(input: {
  name: string;
  category: string;
  price: number;
  qty: number;
}): Promise<Product> {
  const result = await request("products", {
    method: "POST",
    body: input,
  });
  return parseProduct(requiredRecord(result, "product"));
}

export async function updateProduct(
  id: string,
  input: { name: string; category: string; price: number; qty: number },
): Promise<Product> {
  const result = await request(`products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: input,
  });
  return parseProduct(requiredRecord(result, "product"));
}

export async function deleteProduct(id: string): Promise<Product> {
  const result = await request(`products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return parseProduct(requiredRecord(result, "product"));
}

export async function restockProduct(id: string, amount: number): Promise<Product> {
  const result = await request(`products/${encodeURIComponent(id)}/restock`, {
    method: "POST",
    body: { amount },
  });
  return parseProduct(requiredRecord(result, "product"));
}

export async function createCategory(input: {
  nameRw: string;
  nameEn: string;
}): Promise<Category> {
  const result = await request("categories", {
    method: "POST",
    body: input,
  });
  return parseCategory(requiredRecord(result, "category"));
}
