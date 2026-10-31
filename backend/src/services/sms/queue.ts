import { createHash } from "node:crypto";
import type { Types } from "mongoose";
import SmsMessage, { type SmsMessageRecord } from "../../models/sms-message.model.js";
import type { CustomerRecord } from "../../models/customer.model.js";
import type { SmsLocale, SmsTemplateKey } from "./templates.js";

export function reminderKey(...parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

/** `null` when the customer may be contacted, otherwise the time they unlock. */
export function cooldownUntil(
  customer: Pick<CustomerRecord, "lastReminderAt">,
  hours: number,
  now: Date = new Date(),
): Date | null {
  if (!customer.lastReminderAt) return null;
  const until = new Date(customer.lastReminderAt.getTime() + hours * 60 * 60 * 1000);
  return until > now ? until : null;
}

export type QueueReminderInput = {
  shop: string;
  customer: CustomerRecord & { _id: Types.ObjectId };
  saleIds: Types.ObjectId[];
  templateKey: SmsTemplateKey;
  locale: SmsLocale;
  dueDateKey?: string | null;
  daysOverdue?: number | null;
  scheduledFor: Date;
  idempotencyKey: string;
  createdBy?: string | null;
};

/**
 * Put a reminder in the outbox. The body is rendered at dispatch time so a
 * payment made while the message waits is reflected in the amount.
 */
export async function queueReminder(input: QueueReminderInput): Promise<SmsMessageRecord & { _id: Types.ObjectId }> {
  return (await SmsMessage.create({
    shop: input.shop,
    customer: input.customer._id,
    saleIds: input.saleIds,
    to: input.customer.phone,
    templateKey: input.templateKey,
    locale: input.locale,
    dueDateKey: input.dueDateKey ?? null,
    daysOverdue: input.daysOverdue ?? null,
    body: "",
    segments: 0,
    provider: "smsconnect",
    status: "queued",
    attempts: 0,
    scheduledFor: input.scheduledFor,
    idempotencyKey: input.idempotencyKey,
    createdBy: input.createdBy ?? null,
  })) as SmsMessageRecord & { _id: Types.ObjectId };
}

export function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

/** Drop queued reminders as soon as a customer settles their balance. */
export async function cancelQueuedForCustomer(
  shop: string,
  customerId: Types.ObjectId,
  reason: string,
): Promise<number> {
  const result = await SmsMessage.updateMany(
    { shop, customer: customerId, status: "queued" },
    { $set: { status: "cancelled", lastError: reason } },
  );
  return result.modifiedCount;
}
