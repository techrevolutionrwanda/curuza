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