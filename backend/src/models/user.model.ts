import mongoose, { Schema, type Types } from "mongoose";

export type UserRole = "owner" | "manager" | "staff";
export type UserStatus = "invited" | "active" | "disabled";
export type UserLocale = "rw" | "en";

export interface UserRecord {
  shop: Types.ObjectId;
  username: string;
  email?: string;
  password: string;
  phone: string;
  role: UserRole;
  locale: UserLocale;
  status: UserStatus;
  authVersion: number;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserRecord>(
  {
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["owner", "manager", "staff"],
      default: "staff",
    },
    locale: {
      type: String,
      enum: ["rw", "en"],
      default: "rw",
    },
    status: {
      type: String,
      enum: ["invited", "active", "disabled"],
      default: "active",
    },
    authVersion: {
      type: Number,
      default: 0,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ shop: 1, role: 1 });

const User = mongoose.model<UserRecord>("User", userSchema);

export default User;
