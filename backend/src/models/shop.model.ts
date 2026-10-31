import mongoose, { Schema, type Types } from "mongoose";

export type ShopCurrency = "RWF" | "USD" | "EUR" | "KES";

export interface ShopRecord {
  name: string;
  owner: Types.ObjectId;
  currency: ShopCurrency;
  smsReminders: boolean;
  /** Kigali hour automatic reminders are sent at (0-23). */
  smsSendHour: number;
  smsQuietStart: number;
  smsQuietEnd: number;
  /** Minimum hours between two reminders to the same customer. */
  smsCooldownHours: number;
  /** Reminders per debt cycle before automation stops. */
  smsMaxPerDebt: number;
  /** Hard cap of messages sent per Kigali day for this shop. */
  smsDailyLimit: number;
  smsSendOnSunday: boolean;
  /** Last wallet balance reported by the gateway, kept for the settings UI. */
  smsBalance?: number | null;
  smsBalanceAt?: Date | null;
  cloudBackup: boolean;
  lastBackupAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const shopSchema = new Schema<ShopRecord>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    currency: {
      type: String,
      enum: ["RWF", "USD", "EUR", "KES"],
      default: "RWF",
    },
    smsReminders: {
      type: Boolean,
      default: false,
    },
    smsSendHour: {
      type: Number,
      min: 0,
      max: 23,
      default: 9,
    },
    smsQuietStart: {
      type: Number,
      min: 0,
      max: 23,
      default: 7,
    },
    smsQuietEnd: {
      type: Number,
      min: 0,
      max: 23,
      default: 21,
    },
    smsCooldownHours: {
      type: Number,
      min: 1,
      max: 720,
      default: 24,
    },
    smsMaxPerDebt: {
      type: Number,
      min: 1,
      max: 20,
      default: 4,
    },
    smsDailyLimit: {
      type: Number,
      min: 1,
      max: 5000,
      default: 200,
    },
    smsSendOnSunday: {
      type: Boolean,
      default: false,
    },
    smsBalance: {
      type: Number,
      default: null,
    },
    smsBalanceAt: {
      type: Date,
      default: null,
    },
    cloudBackup: {
      type: Boolean,
      default: true,
    },
    lastBackupAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Shop = mongoose.model<ShopRecord>("Shop", shopSchema);

export default Shop;
