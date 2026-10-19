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
  menu: {
    ariaLabel: "Ibikorwa",
  },
  row: {
    edit: "Hindura",
    delete: "Siba",
    restock: "Ongeramo",
  },
  restock: {
    title: "Ongeramo ingano",
    subtitle: "Ongeramo ingano y'igicuruzwa",
    current: "Bisigaye ubu",
    qty: "Ingano yo kongeramo",
    submit: "Ongeramo",
  },
  delete: {
    title: "Siba igicuruzwa",
    subtitle: "Siba '{name}' muri stock",
    confirm: "Siba",
  },
  category: {
    title: "Ongeramo icyiciro",
    subtitle: "Ongeramo icyiciro gishya",
    nameRw: "Izina mu Kinyarwanda",
    nameEn: "Izina mu Cyongereza",
    submit: "Bika icyiciro",
  },
  edit: {
    title: "Hindura igicuruzwa",
  },
  form: {
    errors: {
      required: "Uru ruhande rusabwa",
      number: "Andika umubare",
      invalid: "Agaciro katemewe",
      duplicate: "Iri zina ryarakoreshejwe",
    },
  },
  toast: {
    productAdded: "'{name}' yongewe muri stock",
    productUpdated: "'{name}' yahinduwe",
    productDeleted: "'{name}' yasibwe",
    restocked: "'{name}' yongeweho",
    categoryAdded: "Icyiciro '{name}' cyongewe",
  },
  common: {
    cancel: "Hagarika",
    close: "Funga",
    save: "Bika",
    ok: "Emeza",
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
  menu: {
    ariaLabel: "Actions",
  },
  row: {
    edit: "Edit",
    delete: "Delete",
    restock: "Restock",
  },
  restock: {
    title: "Restock",
    subtitle: "Add quantity to this product",
    current: "Current quantity",
    qty: "Quantity to add",
    submit: "Add to stock",
  },
  delete: {
    title: "Delete product",
    subtitle: "Delete '{name}' from stock",
    confirm: "Delete",
  },
  category: {
    title: "Add category",
    subtitle: "Add a new category",
    nameRw: "Name (Kinyarwanda)",
    nameEn: "Name (English)",
    submit: "Save category",
  },
  edit: {
    title: "Edit product",
  },
  form: {
    errors: {
      required: "This field is required",
      number: "Please enter a number",
      invalid: "Invalid value",
      duplicate: "This name is already used",
    },
  },
  toast: {
    productAdded: "'{name}' added to stock",
    productUpdated: "'{name}' updated",
    productDeleted: "'{name}' deleted",
    restocked: "'{name}' restocked",
    categoryAdded: "Category '{name}' added",
  },
  common: {
    cancel: "Cancel",
    close: "Close",
    save: "Save",
    ok: "OK",
  },
};

export function interpolate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = vars[key];
    return value ?? match;
  });
}

export const dictionaries: Record<Locale, Dictionary> = { rw, en };
