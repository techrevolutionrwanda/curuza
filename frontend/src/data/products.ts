export const CATEGORY_IDS = ["ibinyobwa", "ibiribwa", "isuku"] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type Product = {
  id: string;
  name: string;
  initials: string;
  category: CategoryId;
  price: number;
  qty: number;
};

export type StockStatus = "ok" | "low" | "out";

export function stockStatus(qty: number): StockStatus {
  if (qty <= 0) return "out";
  if (qty <= 10) return "low";
  return "ok";
}

export const PRODUCTS: Product[] = [
  {
    id: "isukari-1kg",
    name: "Isukari 1kg",
    initials: "IS",
    category: "ibiribwa",
    price: 1800,
    qty: 42,
  },
  {
    id: "amazi-1-5l",
    name: "Amazi 1.5L",
    initials: "AM",
    category: "ibinyobwa",
    price: 700,
    qty: 6,
  },
  {
    id: "ifu-yibigori-2kg",
    name: "Ifu y'ibigori 2kg",
    initials: "IF",
    category: "ibiribwa",
    price: 2400,
    qty: 0,
  },
  {
    id: "savoni",
    name: "Savoni",
    initials: "SO",
    category: "isuku",
    price: 500,
    qty: 58,
  },
  {
    id: "fanta-300ml",
    name: "Fanta 300ml",
    initials: "FA",
    category: "ibinyobwa",
    price: 500,
    qty: 9,
  },
];
