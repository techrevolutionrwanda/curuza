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
  customerName: string;
  customerPhone: string;
  paymentMethod: SalePaymentMethod;
  total: number;
  paid: number;
  owed: number;
  createdAt: string;
};

export type CreateSaleInput = {
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: SalePaymentMethod;
  paid: number;
  customerName?: string;
  customerPhone?: string;
};

export function sumSales(sales: Sale[], select: (sale: Sale) => number): number {
  return sales.reduce((sum, sale) => sum + select(sale), 0);
}