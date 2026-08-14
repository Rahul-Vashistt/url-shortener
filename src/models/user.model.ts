import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface User extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  verificationToken?: string | undefined;
  verificationTokenExpiry?: Date | undefined;
  passwordResetToken?: string | undefined;
  passwordResetTokenExpiry?: Date | undefined;
}

const userSchema = new mongoose.Schema<User>(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      uppercase: true,
      default: "USER",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const USER = mongoose.model("User", userSchema);
