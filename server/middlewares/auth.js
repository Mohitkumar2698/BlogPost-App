import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const resolveUserFromToken = async (req) => {
  const { authorization } = req.headers;
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.split(" ")[1]
    : null;
  const token = bearerToken || req.cookies?.token;
  if (!token) {
    return null;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const username =
    typeof decoded === "string" ? decoded : decoded?.username || "";
  const user = await User.findOne({ username });

  if (!user) {
    return null;
  }

  return { user, decoded };
};

export const userAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.split(" ")[1]
    : null;
  const token = bearerToken || req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Please login" });
  }

  try {
    const parsed = await resolveUserFromToken(req);
    if (!parsed) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = parsed.user;
    req.auth = parsed.decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export const optionalUserAuth = async (req, _res, next) => {
  try {
    const parsed = await resolveUserFromToken(req);
    if (parsed) {
      req.user = parsed.user;
      req.auth = parsed.decoded;
    }
    next();
  } catch (_err) {
    next();
  }
};
