import mongoose, { Schema, model } from "mongoose";

const BlogsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now() },
});

export const Blog = model("Blog", BlogsSchema);
