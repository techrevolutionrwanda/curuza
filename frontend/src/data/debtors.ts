export type Debtor = {
  id: string;
  name: string;
  initial: string;
  phone: string;
  date: string;
  total: number;
  paid: number;
  owed: number;
};

export const SAMPLE_DEBTORS: Debtor[] = [
  {
    id: "1",
    name: "Jean Marie",
    initial: "JM",
    phone: "078•••4521",
    date: "18 Ukw 2026",
    total: 64000,
    paid: 19000,
    owed: 45000,
  },
  {
    id: "2",
    name: "Chantal Uwase",
    initial: "CU",
    phone: "072•••9034",
    date: "02 Ukw 2026",
    total: 50000,
    paid: 37500,
    owed: 12500,
  },
  {
    id: "3",
    name: "Eric Nkurunziza",
    initial: "EN",
    phone: "079•••1180",
    date: "24 Nzi 2026",
    total: 30000,
    paid: 3000,
    owed: 27000,
  },
];

/** Formats an amount the way every screen of the app shows it. */
export const formatMoney = (amount: number) => amount.toLocaleString("en-US");
