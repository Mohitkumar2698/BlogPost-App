import { Router } from "express";
import {
  editUser,
  getInfo,
  getUsers,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.js";
import { storage } from "../utils/cloudinary.config.js";
import multer from "multer";

const userRouter = Router();
const upload = multer({ storage });

userRouter.get("/users", getUsers);
userRouter.get("/profile/:username", userAuth, getInfo);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.patch("/profile/edit/:username", upload.single("profilePic"), editUser);

export default userRouter;
