import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface User extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
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
  },
  {
    timestamps: true,
  },
);

export const USER = mongoose.model("User", userSchema);
