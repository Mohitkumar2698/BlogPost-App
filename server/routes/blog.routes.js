import { Router } from "express";
import {
  deleteBlog,
  getAllBlogs,
  getBlogsById,
  getMyBlogs,
  postBlog,
  updateBlog,
} from "../controllers/blogs.controller.js";
import { userAuth } from "../middlewares/auth.js";

const blogRouter = Router();

blogRouter.get("/blogs", getAllBlogs);
blogRouter.get("/blogs/:id", getBlogsById);
blogRouter.get("/:username", userAuth, getMyBlogs);

blogRouter.post("/post", userAuth, postBlog);
blogRouter.patch("/edit/:id", userAuth, updateBlog);
blogRouter.delete("/:id", userAuth, deleteBlog);

export default blogRouter;
