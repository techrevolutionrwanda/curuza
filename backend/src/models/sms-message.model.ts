import mongoose, { Schema, type Types } from "mongoose";
import type { SmsLocale, SmsTemplateKey } from "../services/sms/templates.js";

export type SmsMessageStatus =
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "undelivered"
  | "failed"
  | "cancelled";

export const ACTIVE_SMS_STATUSES: SmsMessageStatus[] = [
  "queued",
  "sending",
  "sent",
];

export interface SmsMessageRecord {
  shop: Types.ObjectId;
  customer?: Types.ObjectId | null;
  saleIds: Types.ObjectId[];
  /** Canonical MSISDN the message goes to. */
  to: string;
  templateKey: SmsTemplateKey;
  locale: SmsLocale;
  /** Due date (YYYY-MM-DD) the automatic rule was based on. */
  dueDateKey?: string | null;
  daysOverdue?: number | null;
  /** Rendered content without the gateway branding. */
  body: string;
  segments: number;
  provider: string;
  providerMessageId?: string | null;
  status: SmsMessageStatus;
  attempts: number;
  lastError?: string | null;
  scheduledFor: Date;
  sentAt?: Date | null;
  deliveredAt?: Date | null;
  lastCheckedAt?: Date | null;
  cost?: number | null;
  createdBy?: Types.ObjectId | null;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const smsMessageSchema = new Schema<SmsMessageRecord>(
  {
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      index: true,
    },
    saleIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Sale" }],
      default: [],
    },
    to: { type: String, required: true, trim: true },
    templateKey: {
      type: String,
      enum: ["manual", "due_soon", "due_today", "overdue", "payment_received"],
      required: true,
    },
    locale: { type: String, enum: ["rw", "en"], default: "rw" },
    dueDateKey: { type: String, default: null },
    daysOverdue: { type: Number, default: null },
    body: { type: String, default: "" },
    segments: { type: Number, default: 0, min: 0 },
    provider: { type: String, default: "smsconnect" },
    providerMessageId: { type: String, default: null, index: true },
    status: {
      type: String,
      enum: ["queued", "sending", "sent", "delivered", "undelivered", "failed", "cancelled"],
      default: "queued",
      index: true,
    },
    attempts: { type: Number, default: 0, min: 0 },
    lastError: { type: String, default: null },
    scheduledFor: { type: Date, required: true, default: () => new Date(), index: true },
    sentAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    lastCheckedAt: { type: Date, default: null },
    cost: { type: Number, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    idempotencyKey: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

smsMessageSchema.index({ shop: 1, createdAt: -1 });
smsMessageSchema.index({ status: 1, scheduledFor: 1 });
smsMessageSchema.index({ shop: 1, customer: 1, createdAt: -1 });

const SmsMessage = mongoose.model<SmsMessageRecord>("SmsMessage", smsMessageSchema);

export default SmsMessage;
