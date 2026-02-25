import mongoose, { Schema, model } from "mongoose";

const ReportSchema = new Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reporterUsername: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["blog", "comment", "user"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in_review", "resolved", "rejected"],
      default: "open",
    },
    adminNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Report = model("Report", ReportSchema);
