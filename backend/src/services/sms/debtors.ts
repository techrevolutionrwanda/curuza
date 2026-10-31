import mongoose from "mongoose";
import Customer, { type CustomerRecord } from "../../models/customer.model.js";
import Sale, { type SaleRecord } from "../../models/sale.model.js";
import { normalizeRwandaPhone, phoneVariants } from "./phone.js";
import type { SmsLocale } from "./templates.js";

export class SmsRequestError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "SmsRequestError";
    this.status = status;
  }
}

type SaleLike = SaleRecord & { _id: mongoose.Types.ObjectId };

export type ResolvedDebtor = {
  customer: CustomerRecord & { _id: mongoose.Types.ObjectId };
  sales: SaleLike[];
  amount: number;
};

/**
 * One customer per phone. Sales created before the Customer model existed are
 * picked up here, so no migration has to run before the first reminder.
 */
export async function ensureCustomer(
  shop: string,
  phone: string,
  name = "",
  locale: SmsLocale = "rw",
): Promise<CustomerRecord & { _id: mongoose.Types.ObjectId }> {
  const update: Record<string, unknown> = {};
  if (name.trim()) update.name = name.trim().slice(0, 120);

  try {
    const customer = await Customer.findOneAndUpdate(
      { shop, phone },
      {
        ...(Object.keys(update).length > 0 ? { $set: update } : {}),
        $setOnInsert: { shop, phone, locale },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
    return customer as CustomerRecord & { _id: mongoose.Types.ObjectId };
  } catch (cause) {
    // Two requests can race on the unique index; the second one just reads.
    if (typeof cause === "object" && cause !== null && "code" in cause && cause.code === 11000) {
      const existing = await Customer.findOne({ shop, phone });
      if (existing) return existing as CustomerRecord & { _id: mongoose.Types.ObjectId };
    }
    throw cause;
  }
}

/** All unpaid sales that belong to one phone number in a shop. */
export async function openSalesForPhone(
  shop: string,
  phone: string,
  customerId: mongoose.Types.ObjectId,
): Promise<SaleLike[]> {
  const variants = phoneVariants(phone);
  const sales = await Sale.find({
    shop,
    owed: { $gt: 0 },
    $or: [{ customer: customerId }, { customerPhone: { $in: variants } }],
  })
    .sort({ createdAt: 1 })
    .lean();

  return sales as unknown as SaleLike[];
}

function amountOf(sales: SaleLike[]): number {
  return sales.reduce((sum, sale) => sum + sale.owed, 0);
}

/**
 * Resolve the customer behind a set of sales. The amount is aggregated across
 * every open sale of that phone, so a customer with three debts gets one
 * message with the total.
 */
export async function resolveDebtor(
  shop: string,
  saleIds: string[],
): Promise<ResolvedDebtor> {
  if (saleIds.length === 0) {
    throw new SmsRequestError("Choose at least one sale.");
  }
  if (saleIds.length > 100) {
    throw new SmsRequestError("Too many sales in one reminder.");
  }
  if (saleIds.some((id) => !mongoose.isValidObjectId(id))) {
    throw new SmsRequestError("Invalid sale id.");
  }

  const selected = (await Sale.find({ _id: { $in: saleIds }, shop }).lean()) as unknown as SaleLike[];
  if (selected.length === 0) {
    throw new SmsRequestError("Sale not found.", 404);
  }
  if (selected.some((sale) => sale.owed <= 0)) {
    throw new SmsRequestError("This customer has no outstanding balance.");
  }

  const withPhone = selected.find((sale) => sale.customerPhone?.trim());
  if (!withPhone) {
    throw new SmsRequestError("This sale has no customer phone number.");
  }

  const phone = normalizeRwandaPhone(withPhone.customerPhone);
  if (!phone) {
    throw new SmsRequestError("The customer's phone is not a valid Rwandan mobile number.");
  }

  const customer = await ensureCustomer(shop, phone, withPhone.customerName);
  const sales = await openSalesForPhone(shop, phone, customer._id);
  const amount = amountOf(sales.length > 0 ? sales : selected);

  return { customer, sales: sales.length > 0 ? sales : selected, amount };
}

/**
 * Every customer with an open balance, grouped by phone. Used by "remind all"
 * and by the automatic planner.
 */
export async function listDebtors(shop: string, limit = 500): Promise<ResolvedDebtor[]> {
  const sales = (await Sale.find({ shop, owed: { $gt: 0 } })
    .sort({ createdAt: 1 })
    .lean()) as unknown as SaleLike[];

  const groups = new Map<string, SaleLike[]>();
  for (const sale of sales) {
    const phone = normalizeRwandaPhone(sale.customerPhone);
    if (!phone) continue;
    const bucket = groups.get(phone);
    if (bucket) bucket.push(sale);
    else groups.set(phone, [sale]);
  }

  const result: ResolvedDebtor[] = [];
  for (const [phone, group] of groups) {
    if (result.length >= limit) break;
    const first = group[0];
    if (!first) continue;
    const customer = await ensureCustomer(shop, phone, first.customerName);
    result.push({
      customer,
      sales: group,
      amount: amountOf(group),
    });
  }
  return result;
}
