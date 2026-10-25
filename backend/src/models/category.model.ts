import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
}, {
  timestamps: true,
});

categorySchema.index({ owner: 1, rw: 1 }, { unique: true });
categorySchema.index({ owner: 1, createdAt: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;
