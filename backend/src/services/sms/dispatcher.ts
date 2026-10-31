import SmsMessage, { type SmsMessageRecord } from "../../models/sms-message.model.js";
import Shop from "../../models/shop.model.js";
import User from "../../models/user.model.js";
import Customer from "../../models/customer.model.js";
import { openSalesForPhone } from "./debtors.js";
import { localPhone, maskPhone, normalizeRwandaPhone } from "./phone.js";
import {
  fetchSmsStatus,
  sendSms,
  SmsGatewayError,
  smsDryRun,
} from "./providers/smsconnect.js";
import { outgoingMessage, renderSms } from "./templates.js";
import {
  dailyLimitFor,
  sendWindowFor,
} from "./settings.js";
import { cancelQueuedForCustomer, cooldownUntil } from "./queue.js";
import {
  nextAllowedMoment,
  nextSendTime,
  startOfKigaliDay,
} from "./time.js";

type MessageDoc = SmsMessageRecord & { _id: import("mongoose").Types.ObjectId };

const RETRY_MINUTES = [1, 5, 15];

export type DispatchSummary = {
  sent: number;
  failed: number;
  rescheduled: number;
  cancelled: number;
};

async function requeue(message: MessageDoc, scheduledFor: Date, reason: string): Promise<void> {
  await SmsMessage.updateOne(
    { _id: message._id },
    { $set: { status: "queued", scheduledFor, lastError: reason } },
  );
}

async function finish(
  message: MessageDoc,
  status: SmsMessageRecord["status"],
  fields: Partial<SmsMessageRecord> = {},
): Promise<void> {
  await SmsMessage.updateOne(
    { _id: message._id },
    { $set: { status, lastCheckedAt: new Date(), ...fields } },
  );
}

async function processOne(message: MessageDoc, summary: DispatchSummary): Promise<void> {
  const shop = await Shop.findById(message.shop);
  if (!shop) {
    await finish(message, "cancelled", { lastError: "Shop no longer exists." });
    summary.cancelled += 1;
    return;
  }

  if (!shop.smsReminders) {
    await finish(message, "cancelled", { lastError: "SMS reminders are turned off." });
    summary.cancelled += 1;
    return;
  }

  const customer = await Customer.findById(message.customer);
  if (!customer) {
    await finish(message, "failed", { lastError: "Customer not found." });
    summary.failed += 1;
    return;
  }

  if (customer.smsOptOut) {
    await finish(message, "cancelled", { lastError: "Customer opted out of SMS." });
    summary.cancelled += 1;
    return;
  }

  const window = sendWindowFor(shop);
  const allowedAt = nextAllowedMoment(new Date(), window);
  if (allowedAt.getTime() > Date.now() + 60_000) {
    await requeue(message, allowedAt, "Held outside quiet hours.");
    summary.rescheduled += 1;
    return;
  }

  // Another reminder may have gone out while this one waited in the queue.
  if (
    customer.lastReminderAt &&
    customer.lastReminderAt > message.createdAt &&
    cooldownUntil(customer, shop.smsCooldownHours ?? 48) !== null
  ) {
    await finish(message, "cancelled", { lastError: "A newer reminder was already sent." });
    summary.cancelled += 1;
    return;
  }

  const phone = normalizeRwandaPhone(customer.phone);
  if (!phone) {
    await finish(message, "failed", { lastError: "Invalid customer phone number." });
    summary.failed += 1;
    return;
  }

  const sales = await openSalesForPhone(shop._id.toString(), phone, customer._id);
  const amount = sales.reduce((sum, sale) => sum + sale.owed, 0);
  if (amount <= 0) {
    await cancelQueuedForCustomer(shop._id.toString(), customer._id, "Balance settled.");
    await Customer.updateOne(
      { _id: customer._id },
      { $set: { reminderCount: 0, lastReminderAt: null } },
    );
    summary.cancelled += 1;
    return;
  }

  const sentToday = await SmsMessage.countDocuments({
    shop: shop._id,
    status: { $in: ["sent", "delivered"] },
    sentAt: { $gte: startOfKigaliDay() },
  });
  if (sentToday >= dailyLimitFor(shop)) {
    await requeue(message, nextSendTime(new Date(), window), "Daily SMS limit reached.");
    summary.rescheduled += 1;
    return;
  }

  const owner = await User.findById(shop.owner).select("phone");
  const shopPhone = owner?.phone ? localPhone(normalizeRwandaPhone(owner.phone) ?? owner.phone) : "";

  const rendered = renderSms(message.templateKey, message.locale, {
    customer: customer.name || customer.phone,
    shop: shop.name,
    amount,
    currency: shop.currency ?? "RWF",
    phone: shopPhone,
    date: message.dueDateKey ?? undefined,
    daysOverdue: message.daysOverdue ?? undefined,
  });

  if (rendered.overBudget) {
    await finish(message, "failed", {
      lastError: `Message is ${rendered.totalLength} characters; shorten the shop or customer name.`,
    });
    summary.failed += 1;
    return;
  }

  await SmsMessage.updateOne(
    { _id: message._id },
    { $set: { body: rendered.body, segments: rendered.segments } },
  );

  try {
    const result = await sendSms(phone, outgoingMessage(rendered.body));
    const now = new Date();
    await finish(message, "sent", {
      providerMessageId: result.providerMessageId,
      sentAt: now,
      cost: result.cost,
      attempts: message.attempts,
      lastError: null,
    });
    await Customer.updateOne(
      { _id: customer._id },
      { $set: { lastReminderAt: now }, $inc: { reminderCount: 1 } },
    );
    if (result.balance !== null) {
      await Shop.updateOne(
        { _id: shop._id },
        { $set: { smsBalance: result.balance, smsBalanceAt: now } },
      );
    }
    console.info(
      "[sms] sent id=%s to=%s template=%s chars=%d",
      message._id.toString(),
      maskPhone(phone),
      message.templateKey,
      rendered.body.length,
    );
    summary.sent += 1;
  } catch (cause) {
    const error = cause instanceof SmsGatewayError ? cause : null;
    const retryable = error?.retryable ?? true;
    const wait = RETRY_MINUTES[Math.min(message.attempts - 1, RETRY_MINUTES.length - 1)] ?? 15;

    if (retryable && message.attempts < 3) {
      await requeue(message, new Date(Date.now() + wait * 60 * 1000), error?.message ?? "Retry scheduled.");
      summary.rescheduled += 1;
      return;
    }

    await finish(message, "failed", {
      lastError: error?.message ?? (cause instanceof Error ? cause.message : "SMS failed."),
    });
    summary.failed += 1;
  }
}

/**
 * A process can die after claiming a message but before recording the result.
 * Put those messages back in the queue so a restart does not strand them.
 */
export async function recoverStuckMessages(): Promise<number> {
  const result = await SmsMessage.updateMany(
    {
      status: "sending",
      updatedAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) },
    },
    { $set: { status: "queued", scheduledFor: new Date() } },
  );
  return result.modifiedCount;
}

/**
 * Claim queued messages one at a time. The atomic claim keeps two worker
 * processes from sending the same reminder twice.
 */
export async function dispatchPending(limit = 10): Promise<DispatchSummary> {
  const summary: DispatchSummary = { sent: 0, failed: 0, rescheduled: 0, cancelled: 0 };

  for (let index = 0; index < limit; index += 1) {
    const message = (await SmsMessage.findOneAndUpdate(
      { status: "queued", scheduledFor: { $lte: new Date() } },
      { $set: { status: "sending" }, $inc: { attempts: 1 } },
      { sort: { scheduledFor: 1 }, returnDocument: "after" },
    )) as MessageDoc | null;

    if (!message) break;
    await processOne(message, summary);
  }

  return summary;
}

/**
 * SMS Connect has no delivery webhook on the documented API, so statuses are
 * polled. A sent message is checked at most every five minutes, for one day.
 */
export async function reconcileStatuses(limit = 10): Promise<number> {
  if (smsDryRun()) return 0;

  const messages = (await SmsMessage.find({
    status: "sent",
    providerMessageId: { $ne: null },
    sentAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    $or: [
      { lastCheckedAt: null },
      { lastCheckedAt: { $lte: new Date(Date.now() - 5 * 60 * 1000) } },
    ],
  })
    .sort({ sentAt: 1 })
    .limit(limit)) as MessageDoc[];

  let updated = 0;
  for (const message of messages) {
    if (!message.providerMessageId || message.providerMessageId.startsWith("dry-")) continue;
    try {
      const status = await fetchSmsStatus(message.providerMessageId);
      const fields: Partial<SmsMessageRecord> = { lastCheckedAt: new Date() };
      if (status === "delivered") fields.deliveredAt = new Date();
      const nextStatus: SmsMessageRecord["status"] =
        status === "delivered" ? "delivered" : status === "failed" ? "failed" : "sent";
      await finish(message, nextStatus, fields);
      updated += 1;
    } catch (cause) {
      await SmsMessage.updateOne(
        { _id: message._id },
        {
          $set: {
            lastCheckedAt: new Date(),
            lastError: cause instanceof Error ? cause.message : "Status check failed.",
          },
        },
      );
    }
  }
  return updated;
}
