import { Router } from "express";
import {
  createReport,
  editUser,
  getBlogs,
  getInfo,
  getMe,
  getMyNotifications,
  getReports,
  getUsers,
  loginUser,
  markNotificationRead,
  logoutUser,
  registerUser,
  toggleFollowUser,
  updateReportStatus,
} from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.js";
import { storage } from "../utils/cloudinary.config.js";
import multer from "multer";

const userRouter = Router();
const upload = multer({ storage });

userRouter.get("/admin/users/:id", userAuth, getUsers);
userRouter.get("/admin/blogs/:id", userAuth, getBlogs);
userRouter.get("/profile/:username", userAuth, getInfo);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", userAuth, logoutUser);
userRouter.get("/me", userAuth, getMe);
userRouter.patch("/users/:username/follow", userAuth, toggleFollowUser);
userRouter.get("/notifications", userAuth, getMyNotifications);
userRouter.patch("/notifications/:id/read", userAuth, markNotificationRead);
userRouter.post("/reports", userAuth, createReport);
userRouter.get("/admin/reports", userAuth, getReports);
userRouter.patch("/admin/reports/:id", userAuth, updateReportStatus);
userRouter.patch(
  "/profile/edit/:username",
  userAuth,
  upload.single("profilePic"),
  editUser
);

export default userRouter;
