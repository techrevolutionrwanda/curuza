/**
 * One-off backfill for shops that existed before Customers and due dates.
 *
 *   npx tsx src/scripts/backfill-customers.ts --apply
 *
 * Without --apply it only reports what would change.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Shop from "../models/shop.model.js";
import Sale from "../models/sale.model.js";
import Customer from "../models/customer.model.js";
import { normalizeRwandaPhone } from "../services/sms/phone.js";
import { addDaysToKey, kigaliDateAt, kigaliDateKey } from "../services/sms/time.js";

dotenv.config();

const apply = process.argv.includes("--apply");

async function main(): Promise<void> {
  await connectDB();
  const shops = await Shop.find().select("_id name");
  let customers = 0;
  let linked = 0;
  let dated = 0;

  for (const shop of shops) {
    const sales = await Sale.find({ shop: shop._id, owed: { $gt: 0 } });
    for (const sale of sales) {
      const phone = normalizeRwandaPhone(sale.customerPhone);
      if (!phone) continue;

      let customer = await Customer.findOne({ shop: shop._id, phone });
      if (!customer) {
        customers += 1;
        if (apply) {
          customer = await Customer.create({
            shop: shop._id,
            phone,
            name: sale.customerName || "",
            locale: "rw",
          });
        }
      }

      const updates: Record<string, unknown> = {};
      if (customer && !sale.customer) {
        updates.customer = customer._id;
        linked += 1;
      }
      if (!sale.dueDate) {
        const createdDue = addDaysToKey(kigaliDateKey(sale.createdAt), 14);
        // Old debts get a fresh two-week term instead of a due date that is
        // already years in the past and would never match a reminder rule.
        const todayKey = kigaliDateKey();
        const dueKey = createdDue < todayKey ? addDaysToKey(todayKey, 14) : createdDue;
        updates.dueDate = kigaliDateAt(dueKey, 12);
        dated += 1;
      }
      if (apply && Object.keys(updates).length > 0) {
        await Sale.updateOne({ _id: sale._id }, { $set: updates });
      }
    }
  }

  console.info(
    "%s customers=%d linkedSales=%d dueDates=%d",
    apply ? "Applied:" : "Dry run (add --apply):",
    customers,
    linked,
    dated,
  );
  await mongoose.disconnect();
}

void main().catch(async (error) => {
  console.error("Backfill failed:", error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
