import Shop from "../../models/shop.model.js";
import SmsMessage from "../../models/sms-message.model.js";
import { listDebtors } from "./debtors.js";
import { cooldownUntil, queueReminder, reminderKey } from "./queue.js";
import { maxPerDebtFor, sendWindowFor } from "./settings.js";
import type { SmsTemplateKey } from "./templates.js";
import {
  daysBetween,
  kigaliDateKey,
  nextAutomaticSend,
} from "./time.js";

export type PlannerSummary = {
  queued: number;
  skipped: number;
};

type Rule = {
  key: SmsTemplateKey;
  dueKey: string;
  priority: number;
  daysOverdue?: number;
};

function ruleForSale(dueDate: Date, todayKey: string): Rule | null {
  const dueKey = kigaliDateKey(dueDate);
  const diff = daysBetween(todayKey, dueKey);

  if (diff === 2) return { key: "due_soon", dueKey, priority: 1 };
  if (diff === 0) return { key: "due_today", dueKey, priority: 2 };
  if (diff === -3 || diff === -7 || diff === -14) {
    return { key: "overdue", dueKey, priority: 3, daysOverdue: -diff };
  }
  return null;
}

/**
 * Turn due dates into queued reminders. Runs on every worker tick; the unique
 * idempotency key makes a second run a no-op.
 */
export async function planReminders(now: Date = new Date()): Promise<PlannerSummary> {
  const summary: PlannerSummary = { queued: 0, skipped: 0 };
  const shops = await Shop.find({ smsReminders: true }).select(
    "name owner currency smsSendHour smsQuietStart smsQuietEnd smsSendOnSunday smsCooldownHours smsMaxPerDebt smsDailyLimit",
  );
  const todayKey = kigaliDateKey(now);

  for (const shop of shops) {
    const window = sendWindowFor(shop);
    const debtors = await listDebtors(shop._id.toString());

    for (const debtor of debtors) {
      if (debtor.customer.smsOptOut) {
        summary.skipped += 1;
        continue;
      }
      if ((debtor.customer.reminderCount ?? 0) >= maxPerDebtFor(shop)) {
        summary.skipped += 1;
        continue;
      }
      if (cooldownUntil(debtor.customer, shop.smsCooldownHours ?? 48, now)) {
        summary.skipped += 1;
        continue;
      }

      let chosen: Rule | null = null;
      for (const sale of debtor.sales) {
        if (!sale.dueDate) continue;
        const rule = ruleForSale(sale.dueDate, todayKey);
        if (rule && (!chosen || rule.priority > chosen.priority)) chosen = rule;
      }
      if (!chosen) continue;

      const key = reminderKey(
        shop._id.toString(),
        debtor.customer._id.toString(),
        chosen.key,
        chosen.dueKey,
      );
      if (await SmsMessage.exists({ idempotencyKey: key })) {
        summary.skipped += 1;
        continue;
      }

      try {
        await queueReminder({
          shop: shop._id.toString(),
          customer: debtor.customer,
          saleIds: debtor.sales.map((sale) => sale._id),
          templateKey: chosen.key,
          locale: debtor.customer.locale ?? "rw",
          dueDateKey: chosen.dueKey,
          daysOverdue: chosen.daysOverdue ?? null,
          scheduledFor: nextAutomaticSend(now, window),
          idempotencyKey: key,
        });
        summary.queued += 1;
      } catch (cause) {
        // A concurrent planner claimed the same reminder.
        if (typeof cause === "object" && cause !== null && "code" in cause && cause.code === 11000) {
          summary.skipped += 1;
          continue;
        }
        console.error("[sms:planner] failed for customer %s:", debtor.customer._id.toString(), cause);
        summary.skipped += 1;
      }
    }
  }

  return summary;
}
