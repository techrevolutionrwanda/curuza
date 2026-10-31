import mongoose, { Schema, type Types } from "mongoose";

export type SalePaymentMethod = "cash" | "partial" | "credit";

export interface SaleItemRecord {
  product: Types.ObjectId;
  name: string;
  category: Types.ObjectId;
  price: number;
  quantity: number;
}

export interface SaleRecord {
  shop: Types.ObjectId;
  items: SaleItemRecord[];
  customerName: string;
  customerPhone: string;
  paymentMethod: SalePaymentMethod;
  total: number;
  paid: number;
  owed: number;
  createdAt: Date;
  updatedAt: Date;
}

const saleItemSchema = new Schema<SaleItemRecord>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const saleSchema = new Schema<SaleRecord>(
  {
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    items: { type: [saleItemSchema], required: true },
    customerName: { type: String, trim: true, default: "" },
    customerPhone: { type: String, trim: true, default: "" },
    paymentMethod: {
      type: String,
      enum: ["cash", "partial", "credit"],
      required: true,
    },
    total: { type: Number, required: true, min: 0 },
    paid: { type: Number, required: true, min: 0 },
    owed: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

saleSchema.index({ shop: 1, createdAt: -1 });
saleSchema.index({ shop: 1, owed: 1 });

const Sale = mongoose.model<SaleRecord>("Sale", saleSchema);

export default Sale;