import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";
import type { Sale } from "@/data/sales";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

function record(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function parseSale(value: unknown): Sale | null {
  const sale = record(value);
  if (
    !sale ||
    typeof sale.id !== "string" ||
    !Array.isArray(sale.items) ||
    typeof sale.customerName !== "string" ||
    typeof sale.customerPhone !== "string" ||
    !["cash", "partial", "credit"].includes(String(sale.paymentMethod)) ||
    typeof sale.total !== "number" ||
    typeof sale.paid !== "number" ||
    typeof sale.owed !== "number" ||
    typeof sale.createdAt !== "string"
  ) {
    return null;
  }

  const parsedItems = sale.items.map((value) => {
    const item = record(value);
    if (
      !item ||
      typeof item.productId !== "string" ||
      typeof item.name !== "string" ||
      typeof item.category !== "string" ||
      typeof item.price !== "number" ||
      typeof item.quantity !== "number"
    ) {
      return null;
    }
    return {
      productId: item.productId,
      name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
    };
  });

  if (parsedItems.some((item) => item === null)) return null;
  const items = parsedItems.filter((item) => item !== null);

  return {
    id: sale.id,
    items,
    customerName: sale.customerName,
    customerPhone: sale.customerPhone,
    paymentMethod: sale.paymentMethod as Sale["paymentMethod"],
    total: sale.total,
    paid: sale.paid,
    owed: sale.owed,
    createdAt: sale.createdAt,
  };
}

export async function listSales(): Promise<Sale[]> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionCookie) throw new Error("Your session has expired. Please log in again.");

  const response = await fetch(`${API_BASE_URL}/api/sales`, {
    cache: "no-store",
    headers: { Cookie: `${SESSION_COOKIE}=${sessionCookie}` },
  });
  if (!response.ok) throw new Error("Unable to load sales.");

  const result: unknown = await response.json();
  const salesValue = record(result)?.sales;
  if (!Array.isArray(salesValue)) throw new Error("The server returned invalid sales data.");

  const sales = salesValue.map(parseSale);
  if (sales.some((sale) => sale === null)) {
    throw new Error("The server returned invalid sales data.");
  }
  return sales as Sale[];
}