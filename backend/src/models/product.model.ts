import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    type: mongoose.Schema.Types.ObjectId,
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
}, {
  timestamps: true,
});

productSchema.index({ owner: 1, createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
