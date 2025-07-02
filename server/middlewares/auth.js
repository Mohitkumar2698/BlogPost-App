import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const userAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  const username = authorization.split(" ")[1];

  if (!username) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Please login" });
  }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
