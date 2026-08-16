import mongoose from "mongoose";

export interface Url {
  originalUrl: string;
  shortId: string;
  clicks: number;
  createdBy: mongoose.Types.ObjectId;
}

const urlSchema = new mongoose.Schema<Url>(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const URL = mongoose.model<Url>("Url", urlSchema);
