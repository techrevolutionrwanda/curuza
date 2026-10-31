import mongoose, { Schema, type Types } from "mongoose";

export type PasswordTokenPurpose = "reset" | "invite";

export interface PasswordResetTokenRecord {
  user: Types.ObjectId;
  tokenHash: string;
  purpose: PasswordTokenPurpose;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const passwordResetTokenSchema = new Schema<PasswordResetTokenRecord>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: ["reset", "invite"],
      default: "reset",
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const PasswordResetToken = mongoose.model<PasswordResetTokenRecord>(
  "PasswordResetToken",
  passwordResetTokenSchema,
);

export default PasswordResetToken;
