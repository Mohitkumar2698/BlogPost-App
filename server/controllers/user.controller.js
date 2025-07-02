import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { Blog } from "../models/blog.js";

export const registerUser = async (req, res) => {
  const { password, username } = req.body;
  const haveUser = await User.findOne({ username });
  if (!haveUser) {
    const hashedPass = await bcrypt.hash(password, 10);
    const registered = await User.create({ ...req.body, password: hashedPass });
    if (!registered)
      return res
        .status(400)
        .json({ success: false, message: "Please enter valid data!!" });
    const token = jwt.sign(registered.username, process.env.JWT_SECRET);

    const headers = {
      httpOnly: true,
      secure: "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    };

    res.cookie("token", token, headers);

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully!", token });
  }
  return res.status(400).json({
    success: false,
    message: "Already have user please login!!",
  });
};

export const loginUser = async (req, res) => {
  const { password, username } = req.body;

  const user = await User.findOne({ username });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "username or password is incorrect!!" });

  const isValidPass = await bcrypt.compare(password, user.password);

  if (!isValidPass)
    return res
      .status(400)
      .json({ success: false, message: "username or password is incorrect!!" });

  const token = jwt.sign(user.username, process.env.JWT_SECRET);

  const headers = {
    httpOnly: true,
    secure: "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  };

  res.cookie("token", token, headers);

  return res
    .status(200)
    .json({ success: true, message: "User logged in successfully!!", token });
};

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json({ users });
};

export const getInfo = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  const allBlogs = await Blog.find({ author: username });
  const blogs = allBlogs.length;
  user.blogs = blogs;

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Unauthorized - Access denied!!" });
  }
  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const editUser = async (req, res) => {
  const { username } = req.params;
  const edited = await User.updateOne(
    { username },
    { profilePic: req.file.path }
  );
  if (!edited) {
    return res.status(400).json({ success: false, message: "Cannot update !" });
  }
  return res.status(200).json({
    success: true,
    message: "Profile Photo Updated Successfully",
  });
};
