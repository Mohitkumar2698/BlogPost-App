import { Blog } from "../models/blog.js";
import { User } from "../models/user.js";

export const getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find();
    if (!allBlogs)
      res.status(200).json({ success: true, message: "No blogs Available" });
    res
      .status(200)
      .json({ success: true, message: "fetching all blogs", data: allBlogs });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: `Server error:${error.message}` });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const author = req.user.username;
    const allBlogs = await Blog.find({ author });
    if (!allBlogs)
      return res
        .status(400)
        .json({ success: false, message: "No Blogs Available !" });
    console.log(allBlogs);

    return res
      .status(201)
      .json({ success: true, message: "fetching your blogs!", allBlogs });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server error:${error.message}`,
    });
  }
};

export const getBlogsById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog)
      res.status(400).json({ success: false, message: "Invalid data!!" });
    res
      .status(200)
      .json({ success: true, message: "fetching your blog!", blog });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Server error:${error.message}`,
    });
  }
};

export const postBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const newBlog = new Blog({
      title,
      author: req.user.username,
      author_id: req.user._id,
      content,
      category,
    });
    await newBlog.save();
    res
      .status(201)
      .json({ success: true, message: "blog Posted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: `Server error:${error.message}` });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Blog.findByIdAndUpdate(id, req.body);
    if (!updated)
      res.status(400).json({ success: false, message: "Invalid data!!" });
    res
      .status(201)
      .json({ success: true, message: "blog updated successfully!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Server error:${error.message}`,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted)
      res.status(400).json({ success: false, message: "Cannot data!!" });
    res
      .status(201)
      .json({ success: true, message: "blog deleted successfully!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Server error:${error.message}`,
    });
  }
};
