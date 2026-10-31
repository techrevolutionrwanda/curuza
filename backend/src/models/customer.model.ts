import mongoose, { Schema, type Types } from "mongoose";

export type CustomerLocale = "rw" | "en";

export interface CustomerRecord {
  shop: Types.ObjectId;
  /** Canonical Rwandan MSISDN, e.g. 250788123456. */
  phone: string;
  name: string;
  locale: CustomerLocale;
  /** Never send reminders to this customer again. */
  smsOptOut: boolean;
  /** Reminders sent for the current debt cycle. */
  reminderCount: number;
  lastReminderAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<CustomerRecord>(
  {
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    locale: {
      type: String,
      enum: ["rw", "en"],
      default: "rw",
    },
    smsOptOut: {
      type: Boolean,
      default: false,
    },
    reminderCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastReminderAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// One customer per phone number per shop.
customerSchema.index({ shop: 1, phone: 1 }, { unique: true });

const Customer = mongoose.model<CustomerRecord>("Customer", customerSchema);

export default Customer;
