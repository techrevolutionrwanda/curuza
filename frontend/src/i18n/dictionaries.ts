export const LOCALES = ["rw", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABEL: Record<Locale, string> = {
  rw: "Kinyarwanda",
  en: "English",
};

export const DEFAULT_LOCALE: Locale = "rw";

const rw = {
  stock: {
    title: "Stock",
    subtitle: "Ibicuruzwa n'ibisigaye",
    addCategory: "Ongeramo icyiciro",
    addProduct: "Ongeramo ibicuruzwa",
    searchLabel: "Shakisha igicuruzwa",
    searchPlaceholder: "Shakisha…",
    chips: {
      all: "Byose",
      low: "Biri hafi gushira",
    },
    categories: {
      ibinyobwa: "Ibinyobwa",
      ibiribwa: "Ibiribwa",
      isuku: "Isuku",
    },
    columns: {
      product: "Igicuruzwa",
      category: "Icyiciro",
      price: "Igiciro",
      remaining: "Bisigaye",
      status: "Imiterere",
    },
    status: {
      ok: "Birahagije",
      low: "Biri hafi gushira",
      out: "Byashize",
    },
    add: "Ongeramo",
    empty: "Nta gicuruzwa kibonyeye",
  },
  addProduct: {
    title: "Ongeramo igicuruzwa",
    subtitle: "Inzira y'ongeramo ibicuruzwa",
    name: "Igicuruzwa",
    namePlaceholder: "Urugero: Isukari 1kg",
    category: "Icyiciro",
    price: "Igiciro (RWF)",
    qty: "Bisigaye",
    submit: "Bika igicuruzwa",
  },
  common: {
    cancel: "Hagarika",
  },
};

export type Dictionary = typeof rw;

const en: Dictionary = {
  stock: {
    title: "Stock",
    subtitle: "Products & quantities",
    addCategory: "Add category",
    addProduct: "Add product",
    searchLabel: "Search products",
    searchPlaceholder: "Search…",
    chips: {
      all: "All",
      low: "Low stock",
    },
    categories: {
      ibinyobwa: "Drinks",
      ibiribwa: "Food",
      isuku: "Cleaning",
    },
    columns: {
      product: "Product",
      category: "Category",
      price: "Price",
      remaining: "Qty",
      status: "Status",
    },
    status: {
      ok: "In stock",
      low: "Low stock",
      out: "Out of stock",
    },
    add: "Add",
    empty: "No products found",
  },
  addProduct: {
    title: "Add product",
    subtitle: "Add a new product to your stock",
    name: "Product name",
    namePlaceholder: "e.g. Sugar 1kg",
    category: "Category",
    price: "Price (RWF)",
    qty: "Quantity",
    submit: "Save product",
  },
  common: {
    cancel: "Cancel",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { rw, en };
