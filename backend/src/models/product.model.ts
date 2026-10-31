import mongoose, { Schema, type Types } from "mongoose";

export interface ProductRecord {
  shop: Types.ObjectId;
  name: string;
  initials: string;
  category: Types.ObjectId;
  price: number;
  qty: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductRecord>(
  {
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    initials: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    qty: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ shop: 1, createdAt: -1 });

const Product = mongoose.model<ProductRecord>("Product", productSchema);

export default Product;
