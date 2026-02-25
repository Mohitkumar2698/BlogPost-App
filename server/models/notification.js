import mongoose, { Schema, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorUsername: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "reply", "follow", "mention", "report_update"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      default: null,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = model("Notification", NotificationSchema);
