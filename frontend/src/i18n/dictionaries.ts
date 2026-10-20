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
  nav: {
    home: "Ahabanza",
    stock: "Stock",
    debtors: "Amadeni",
    reports: "Raporo",
    settings: "Igenamiterere",
    planDescription:
      "Ubutumwa (SMS) bwo kurembera abakiriya, raporo nziza n'ubwikorezi bwa cloud.",
    planCta: "Menya byinshi",
  },
  topbar: {
    search: "Shakisha igicuruzwa cyangwa umukiriya…",
    sync: "Byabitswe",
    newSale: "Gurisha",
    owner: "Nyiri duka · Owner",
  },
  weekdays: ["Mbe", "Kab", "Gat", "Gnd", "Gat", "Ruh", "Cyu"],
  home: {
    greeting: "Muraho",
    subtitle: "Uko ubucuruzi bwawe buhagaze uyu munsi · Your business today",
    periodLabel: "Igihe · Period",
    segments: ["Uyu munsi", "Icyumweru", "Ukwezi"],
    kpis: {
      sales: {
        label: "Ibyagurishijwe · Sales",
        trend: "▲ 12% ugereranyije n'ejo",
      },
      cash: {
        label: "Yakiriwe · Cash in",
        trend: "▲ 7%",
      },
      debtors: {
        label: "Amadeni · Owed to you",
        trend: "{count} abakiriya",
      },
      lowStock: {
        label: "Stock nke · Low stock",
        unit: "ibicuruzwa",
        trend: "{count} byashize",
      },
    },
    promo: {
      tag: "IGICIRO",
      title: "Isukari -8% kuri Kg 50",
      subtitle: "Ikoreshwa kugeza ku wa gatanu · Supplier offer",
      cta: "Reba",
    },
    chart: {
      title: "Ibyagurishijwe mu cyumweru",
      subtitle: "Sales this week · RWF",
    },
    restock: {
      title: "Biri hafi gushira",
      subtitle: "Needs restocking",
      cta: "Byose",
      empty: "Nta kintu gishyura · Nothing to restock",
      out: "Byashize",
      remaining: "{count} bisigaye",
    },
    debtors: {
      title: "Amadeni ya vuba",
      subtitle: "Recent debtors",
      cta: "Reba byose",
      columns: {
        customer: "Umukiriya",
        repaid: "Yishyuwe",
        owed: "Asigaye",
      },
      sms: "SMS",
    },
    sale: {
      title: "Igurisha rishya",
      subtitle: "New sale · hitamo ibicuruzwa n'uburyo bwo kwishyura",
      total: "Yose hamwe · Total",
      cancel: "Hagarika",
      save: "Bika igurisha",
      payment: {
        cash: { label: "Amafaranga", sub: "Cash" },
        partial: { label: "Igice", sub: "Partial" },
        credit: { label: "Ideni", sub: "Credit" },
      },
    },
  },
  reports: {
    title: "Raporo",
    subtitle: "Sobanura ibucuruzi bwawe",
    periodLabel: "Igihe · Period",
    periods: ["Uyu munsi", "Icyumweru", "Ukwezi", "Hitamo"],
    export: "Sohora · Export",
    profit: {
      title: "Inyungu yagereranijwe",
      subtitle: "Inyungu y'igihe cyatoranyijwe",
      chartLabel: "Inyungu yagereranijwe ku munsi w'iminsi itandatu",
      trend: "+12%",
    },
    summary: {
      title: "Incamake · Summary",
      rows: {
        sales: "Ibyagurishijwe · Sales",
        cash: "Yakiriwe · Cash collected",
        credit: "Ku ideni · Credit given",
        cost: "Igiciro cy'ibicuruzwa · Cost of goods",
        expenses: "Ibindi bikoreshwa · Expenses",
      },
      note: "Ideni si amafaranga yinjiye. Inyungu ni igereranya rishingiye ku biciro wanditse.",
    },
    categories: {
      title: "Ibyaguzwe cyane · Top categories",
      subtitle: "Inyungu y'ibigurishijwe icyiciro ku bicuruzwa",
      rowLabel: "Inyungu y'ibigurishijwe {name}",
      units: "{count} pcs",
    },
  },
  debtors: {
    title: "Amadeni",
    subtitle: "Abafitanye ideni · Who owes what",
    search: "Shakisha umukiriya...",
    searchLabel: "Shakisha umukiriya",
    summary: {
      total: "Yose hamwe · Total owed",
      customers: "Abakiriya · Customers",
      repaid: "Yishyuwe uku kwezi · Repaid this month",
    },
    columns: {
      customer: "Umukiriya",
      phone: "Telefoni",
      total: "Yose",
      repaid: "Yishyuwe",
      owed: "Asigaye",
      actions: "Ibikorwa",
    },
    empty: "Nta mukiriya uhuye n'ibyo washakishije.",
    sms: "SMS",
    pay: "Kwishyura",
    paying: "...",
    progressLabel: "{name} repayment progress",
    alerts: {
      nothingOwed: "Uyu mukiriya nta deni asigaje.",
      amountPrompt: "Amafaranga yishyuwe (asigaye {amount} RWF):",
      amountInvalid: "Andika amafaranga hagati ya 1 na {amount} RWF.",
      smsReminder:
        "Kwibutsa {name} kuri SMS bizaboneka igihe SMS izaba ihujwe.",
    },
  },
  settings: {
    title: "Igenamiterere",
    subtitle: "Ubucuruzi, ururimi n'ubutumwa",
    rows: {
      language: "Ururimi · Language",
      sms: "Kwibutsa abafite ideni (SMS)",
      backup: "Backup ya cloud",
      lastBackup: "Backup yabereye",
    },
    form: {
      name: "Izina ry'ubucuruzi",
      namePlaceholder: "Urugero: Duka rya Mukamana",
      phone: "Telefoni",
      phonePlaceholder: "+250 788 000 000",
      currency: "Ifaranga · Currency",
      save: "Bika",
      saving: "Kubika...",
    },
    badge: {
      plus: "Plus",
      active: "Ikora",
      inactive: "Ntiko",
      never: "Nta backup",
    },
  },
  toast: {
    productAdded: "'{name}' yongewe muri stock",
    productUpdated: "'{name}' yahinduwe",
    productDeleted: "'{name}' yasibwe",
    restocked: "'{name}' yongeweho",
    categoryAdded: "Icyiciro '{name}' cyongewe",
    settingsSaved: "Igenamiterere ryabitswe",
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
  nav: {
    home: "Home",
    stock: "Stock",
    debtors: "Debtors",
    reports: "Reports",
    settings: "Settings",
    planDescription: "SMS reminders, richer reports and cloud backup.",
    planCta: "Learn more",
  },
  topbar: {
    search: "Search for a product or a customer…",
    sync: "Synced",
    newSale: "New sale",
    owner: "Shop owner",
  },
  weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  home: {
    greeting: "Hello",
    subtitle: "Here is how your business is doing today",
    periodLabel: "Period",
    segments: ["Today", "This week", "This month"],
    kpis: {
      sales: {
        label: "Sales",
        trend: "▲ 12% vs yesterday",
      },
      cash: {
        label: "Cash in",
        trend: "▲ 7%",
      },
      debtors: {
        label: "Owed to you",
        trend: "{count} customers",
      },
      lowStock: {
        label: "Low stock",
        unit: "products",
        trend: "{count} out of stock",
      },
    },
    promo: {
      tag: "OFFER",
      title: "Sugar -8% for 50 kg",
      subtitle: "Valid until Friday · Supplier offer",
      cta: "See offer",
    },
    chart: {
      title: "Sales this week",
      subtitle: "Sales of the last 7 days · RWF",
    },
    restock: {
      title: "Needs restocking",
      subtitle: "Products to reorder",
      cta: "All",
      empty: "Nothing to restock",
      out: "Out of stock",
      remaining: "{count} left",
    },
    debtors: {
      title: "Recent debtors",
      subtitle: "Who still owes you",
      cta: "See all",
      columns: {
        customer: "Customer",
        repaid: "Repaid",
        owed: "Owed",
      },
      sms: "SMS",
    },
    sale: {
      title: "New sale",
      subtitle: "New sale · pick the products and how to pay",
      total: "Total",
      cancel: "Cancel",
      save: "Save sale",
      payment: {
        cash: { label: "Cash", sub: "Cash" },
        partial: { label: "Partial", sub: "Partial" },
        credit: { label: "Credit", sub: "Credit" },
      },
    },
  },
  reports: {
    title: "Reports",
    subtitle: "Understand your business",
    periodLabel: "Period",
    periods: ["Today", "This week", "This month", "Custom"],
    export: "Export",
    profit: {
      title: "Estimated profit",
      subtitle: "Profit of the selected period",
      chartLabel: "Estimated profit by day for the last seven days",
      trend: "+12%",
    },
    summary: {
      title: "Summary",
      rows: {
        sales: "Sales",
        cash: "Cash collected",
        credit: "Credit given",
        cost: "Cost of goods",
        expenses: "Expenses",
      },
      note: "Debt is not money in the bank. The profit is what is left from what you sold.",
    },
    categories: {
      title: "Top categories",
      subtitle: "Sales volume by product category",
      rowLabel: "{name} sales volume",
      units: "{count} pcs",
    },
  },
  debtors: {
    title: "Debtors",
    subtitle: "Who owes what",
    search: "Search a customer...",
    searchLabel: "Search a customer",
    summary: {
      total: "Total owed",
      customers: "Customers",
      repaid: "Repaid this month",
    },
    columns: {
      customer: "Customer",
      phone: "Phone",
      total: "Total",
      repaid: "Repaid",
      owed: "Owed",
      actions: "Actions",
    },
    empty: "No customer matches your search.",
    sms: "SMS",
    pay: "Pay",
    paying: "...",
    progressLabel: "{name} repayment progress",
    alerts: {
      nothingOwed: "This customer owes nothing.",
      amountPrompt: "Amount paid ({amount} RWF left):",
      amountInvalid: "Enter an amount between 1 and {amount} RWF.",
      smsReminder:
        "A reminder for {name} will be sent by SMS once SMS is enabled.",
    },
  },
  settings: {
    title: "Settings",
    subtitle: "Business, language and SMS",
    rows: {
      language: "Ururimi · Language",
      sms: "SMS debtor reminders",
      backup: "Cloud backup",
      lastBackup: "Last backup",
    },
    form: {
      name: "Business name",
      namePlaceholder: "e.g. Mukamana shop",
      phone: "Phone",
      phonePlaceholder: "+250 788 000 000",
      currency: "Ifaranga · Currency",
      save: "Save",
      saving: "Saving...",
    },
    badge: {
      plus: "Plus",
      active: "Active",
      inactive: "Off",
      never: "Never",
    },
  },
  toast: {
    productAdded: "'{name}' added to stock",
    productUpdated: "'{name}' updated",
    productDeleted: "'{name}' deleted",
    restocked: "'{name}' restocked",
    categoryAdded: "Category '{name}' added",
    settingsSaved: "Settings saved",
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
