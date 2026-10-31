import mongoose, { Schema, type Types } from "mongoose";

export interface CategoryRecord {
  shop: Types.ObjectId;
  rw: string;
  en: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryRecord>(
  {
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    rw: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    en: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ shop: 1, rw: 1 }, { unique: true });
categorySchema.index({ shop: 1, createdAt: 1 });

const Category = mongoose.model<CategoryRecord>("Category", categorySchema);

export default Category;
