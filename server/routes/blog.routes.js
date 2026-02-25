import { Router } from "express";
import {
  createComment,
  deleteComment,
  getBookmarkedBlogs,
  deleteBlog,
  getAllBlogs,
  getBlogsById,
  getCommentsByBlog,
  getFollowingFeed,
  getForYouFeed,
  getMyBlogs,
  postBlog,
  toggleBookmarkBlog,
  toggleLikeBlog,
  toggleLikeComment,
  updateBlog,
} from "../controllers/blogs.controller.js";
import { optionalUserAuth, userAuth } from "../middlewares/auth.js";
import { storage } from "../utils/cloudinary.config.js";
import multer from "multer";

const blogRouter = Router();
const upload = multer({ storage });

blogRouter.get("/blogs", optionalUserAuth, getAllBlogs);
blogRouter.get("/feed/for-you", optionalUserAuth, getForYouFeed);
blogRouter.get("/feed/following", userAuth, getFollowingFeed);
blogRouter.get("/bookmarks", userAuth, getBookmarkedBlogs);
blogRouter.get("/blogs/:id", optionalUserAuth, getBlogsById);
blogRouter.get("/blogs/:id/comments", optionalUserAuth, getCommentsByBlog);
blogRouter.get("/:username", optionalUserAuth, getMyBlogs);

blogRouter.post("/post", userAuth, upload.single("coverImage"), postBlog);
blogRouter.post("/blogs/:id/comments", userAuth, createComment);
blogRouter.patch("/blogs/:id/like", userAuth, toggleLikeBlog);
blogRouter.patch("/blogs/:id/bookmark", userAuth, toggleBookmarkBlog);
blogRouter.patch("/comments/:id/like", userAuth, toggleLikeComment);
blogRouter.patch("/edit/:id", userAuth, upload.single("coverImage"), updateBlog);
blogRouter.delete("/comments/:id", userAuth, deleteComment);
blogRouter.delete("/:id", userAuth, deleteBlog);

export default blogRouter;
