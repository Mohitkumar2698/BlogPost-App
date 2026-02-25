import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { Blog } from "../models/blog.js";
import { sendWelcomeEmail } from "../utils/mailConfig.js";
import { Notification } from "../models/notification.js";
import { Report } from "../models/report.js";
import { createNotification } from "../utils/notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const buildAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24,
});

const signToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

export const registerUser = asyncHandler(async (req, res) => {
  const { password, username, email } = req.body;
  if (!password || !username || !email) {
    return res.status(400).json({
      success: false,
      message: "Username, email and password are required",
    });
  }

  const haveUser = await User.findOne({ username });
  if (haveUser)
    return res.status(400).json({
      success: false,
      message: "Already have user please login!!",
    });

  const hashedPass = await bcrypt.hash(password, 10);
  const registered = await User.create({
    username,
    email,
    password: hashedPass,
    role: "user",
  });

  if (!registered) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter valid data!!" });
  }

  const token = signToken(registered);
  const registeredData = registered.toObject();
  delete registeredData.password;

  res.cookie("token", token, buildAuthCookieOptions());

  // await sendWelcomeEmail(email, username);

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
    user: registeredData,
    token,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { password, username } = req.body;
  if (!password || !username) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "username or password is incorrect!!" });
  }

  const isValidPass = await bcrypt.compare(password, user.password);

  if (!isValidPass) {
    return res.status(400).json({
      success: false,
      message: "username or password is incorrect!!",
    });
  }

  const token = signToken(user);
  const userData = user.toObject();
  delete userData.password;

  res.cookie("token", token, buildAuthCookieOptions());

  return res.status(200).json({
    success: true,
    message: "User logged in successfully!!",
    user: userData,
    token,
  });
});

export const getInfo = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ success: false, message: "Profile not found" });
  }

  const allBlogs = await Blog.find({ author: username });
  const blogs = allBlogs.length;
  const userData = user.toObject();
  userData.blogs = blogs;
  delete userData.password;
  userData.followersCount = userData.followers?.length || 0;
  userData.followingCount = userData.following?.length || 0;
  userData.isFollowing = req.user
    ? userData.followers?.some((id) => id.toString() === req.user._id.toString())
    : false;

  return res.status(200).json({
    success: true,
    data: userData,
  });
});

export const editUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (req.user.username !== username && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - You cannot edit this profile",
    });
  }

  if (!req.file?.path) {
    return res.status(400).json({
      success: false,
      message: "Please upload a valid profile image",
    });
  }

  const edited = await User.updateOne({ username }, { profilePic: req.file.path });
  if (!edited) {
    return res.status(400).json({ success: false, message: "Cannot update !" });
  }

  return res.status(200).json({
    success: true,
    message: "Profile Photo Updated Successfully",
  });
});

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "! Unauthorized - Access Denied",
      });
    }

    const users = await User.find();
    const sanitizedUsers = users.map((user) => {
      const parsedUser = user.toObject();
      delete parsedUser.password;
      return parsedUser;
    });

    return res.status(200).json({
      success: true,
      message: "Fetching Users...",
      users: sanitizedUsers,
    });
  } catch (_error) {
    return res.status(400).json({
      success: false,
      message: "Cannot get!",
    });
  }
};

export const getBlogs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "! Unauthorized - Access Denied",
      });
    }

    const blogs = await Blog.find();
    return res.status(200).json({
      success: true,
      message: "Fetching Users...",
      blogs,
    });
  } catch (_error) {
    return res.status(400).json({
      success: false,
      message: "Cannot get!",
    });
  }
};

export const logoutUser = asyncHandler(async (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const userData = req.user.toObject();
  delete userData.password;

  return res.status(200).json({
    success: true,
    user: userData,
  });
});

export const toggleFollowUser = async (req, res) => {
  try {
    const { username } = req.params;
    const targetUser = await User.findOne({ username });
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const isFollowing = req.user.following.some(
      (id) => id.toString() === targetUser._id.toString()
    );

    if (isFollowing) {
      req.user.following = req.user.following.filter(
        (id) => id.toString() !== targetUser._id.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      req.user.following.push(targetUser._id);
      targetUser.followers.push(req.user._id);
      await createNotification({
        userId: targetUser._id,
        actorId: req.user._id,
        actorUsername: req.user.username,
        type: "follow",
        message: `${req.user.username} started following you`,
      });
    }

    await Promise.all([req.user.save(), targetUser.save()]);

    return res.status(200).json({
      success: true,
      following: !isFollowing,
      followersCount: targetUser.followers.length,
      followingCount: req.user.following.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You cannot update this notification",
      });
    }

    notification.read = true;
    await notification.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason } = req.body;
    if (!targetType || !targetId || !reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "targetType, targetId and reason are required",
      });
    }

    const report = await Report.create({
      reporterId: req.user._id,
      reporterUsername: req.user.username,
      targetType,
      targetId,
      reason: reason.trim(),
    });

    return res.status(201).json({ success: true, report });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getReports = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "! Unauthorized - Access Denied",
      });
    }

    const reports = await Report.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "! Unauthorized - Access Denied",
      });
    }

    const { id } = req.params;
    const { status, adminNote = "" } = req.body;
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    report.status = status || report.status;
    report.adminNote = adminNote;
    await report.save();

    await createNotification({
      userId: report.reporterId,
      actorId: req.user._id,
      actorUsername: req.user.username,
      type: "report_update",
      message: `Your report status is now "${report.status}"`,
    });

    return res.status(200).json({ success: true, report });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
