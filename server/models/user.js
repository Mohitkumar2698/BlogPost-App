import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  bio: {
    type: String,
    default: "",
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
  blockedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  mutedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const User = model("User", UserSchema);
