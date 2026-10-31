import type { Sale } from "@/data/sales";

export type Debtor = {
  id: string;
  name: string;
  initial: string;
  phone: string;
  date: string;
  dueDate: string | null;
  total: number;
  paid: number;
  owed: number;
};

export function saleToDebtor(sale: Sale): Debtor {
  const name = sale.customerName || sale.customerPhone;
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

  return {
    id: sale.id,
    name,
    initial: initials || "?",
    phone: sale.customerPhone,
    date: sale.createdAt,
    dueDate: sale.dueDate,
    total: sale.total,
    paid: sale.paid,
    owed: sale.owed,
  };
}

/** Formats an amount the way every screen of the app shows it. */
export const formatMoney = (amount: number) => amount.toLocaleString("en-US");
