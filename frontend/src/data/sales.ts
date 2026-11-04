export type SalePaymentMethod = "cash" | "partial" | "credit";

export type SaleItem = {
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

export type Sale = {
  id: string;
  items: SaleItem[];
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  paymentMethod: SalePaymentMethod;
  total: number;
  paid: number;
  owed: number;
  /** ISO due date for an unpaid balance, null for cash sales. */
  dueDate: string | null;
  createdAt: string;
};

export type CreateSaleInput = {
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: SalePaymentMethod;
  paid: number;
  customerName?: string;
  customerPhone?: string;
  /** `YYYY-MM-DD`; the backend defaults to a 14 day term when omitted. */
  dueDate?: string;
};

export function sumSales(sales: Sale[], select: (sale: Sale) => number): number {
  return sales.reduce((sum, sale) => sum + select(sale), 0);
}

/**
 * Start of the selected home/report period.
 *
 * 0 = today, 1 = this week (Monday), 2 = this month.
 */
export function periodStart(period: number, now = new Date()): Date {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (period === 1) {
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  } else if (period === 2) {
    start.setDate(1);
  }
  return start;
}

/** Sales that fall inside the selected period, up to the end of today. */
export function filterSalesByPeriod(
  sales: Sale[],
  period: number,
  now = new Date(),
): Sale[] {
  const start = periodStart(period, now);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return sales.filter((sale) => {
    const createdAt = new Date(sale.createdAt);
    return createdAt >= start && createdAt <= end;
  });
}