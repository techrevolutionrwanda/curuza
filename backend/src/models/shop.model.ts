import mongoose, { Schema, type Types } from "mongoose";

export type ShopCurrency = "RWF" | "USD" | "EUR" | "KES";

export interface ShopRecord {
  name: string;
  owner: Types.ObjectId;
  currency: ShopCurrency;
  smsReminders: boolean;
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
