import { Blog } from "../models/blog.js";
import { Comment } from "../models/comment.js";
import { User } from "../models/user.js";
import { createNotification } from "../utils/notification.js";

const withDerivedFields = (blogDoc, currentUser = null) => {
  const blog = blogDoc.toObject ? blogDoc.toObject() : { ...blogDoc };
  const likedBy = blog.likedBy || [];
  blog.likesCount = likedBy.length;
  blog.isLiked = currentUser ? likedBy.some((id) => id.toString() === currentUser._id.toString()) : false;
  blog.isFollowing = currentUser
    ? (currentUser.following || []).some(
        (id) => id.toString() === blog.author_id?.toString()
      )
    : false;
  return blog;
};

export const getAllBlogs = async (req, res) => {
  try {
    const { q = "", category = "" } = req.query;
    const query = {};

    if (category.trim()) {
      query.category = { $regex: `^${category.trim()}$`, $options: "i" };
    }

    if (q.trim()) {
      query.$or = [
        { title: { $regex: q.trim(), $options: "i" } },
        { content: { $regex: q.trim(), $options: "i" } },
        { author: { $regex: q.trim(), $options: "i" } },
        { category: { $regex: q.trim(), $options: "i" } },
      ];
    }

    const allBlogs = await Blog.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "fetching all blogs",
      data: allBlogs.map((blog) => withDerivedFields(blog, req.user || null)),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Internal server error" });
  }
};

export const getForYouFeed = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    const enriched = blogs.map((blog) => withDerivedFields(blog, req.user || null));
    const ranked = enriched.sort((a, b) => {
      const scoreA = a.likesCount * 3 + (a.commentsCount || 0);
      const scoreB = b.likesCount * 3 + (b.commentsCount || 0);
      return scoreB - scoreA;
    });

    return res.status(200).json({
      success: true,
      feedType: "for_you",
      data: ranked,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getFollowingFeed = async (req, res) => {
  try {
    const following = req.user.following || [];
    const blogs = await Blog.find({ author_id: { $in: following } }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      feedType: "following",
      data: blogs.map((blog) => withDerivedFields(blog, req.user)),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const { username } = req.params;
    const allBlogs = await Blog.find({ author: username }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "fetching profile blogs!",
      allBlogs: allBlogs.map((blog) => withDerivedFields(blog, req.user || null)),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getBlogsById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    return res.status(200).json({
      success: true,
      message: "fetching your blog!",
      blog: withDerivedFields(blog, req.user || null),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const postBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, content and category are required",
      });
    }

    if (!req.file?.path) {
      return res.status(400).json({
        success: false,
        message: "A cover image is required",
      });
    }

    const newBlog = new Blog({
      title,
      author: req.user.username,
      author_id: req.user._id,
      content,
      category,
      imageUrl: req.file.path,
    });
    await newBlog.save();

    return res.status(201).json({
      success: true,
      message: "Blog posted successfully!",
      blog: withDerivedFields(newBlog, req.user),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Internal server error" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const isOwner = blog.author_id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You cannot edit this blog",
      });
    }

    const payload = { ...req.body };
    if (req.file?.path) {
      payload.imageUrl = req.file.path;
    }

    const updated = await Blog.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(400).json({ success: false, message: "Invalid data!!" });
    }

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully!",
      blog: withDerivedFields(updated, req.user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const isOwner = blog.author_id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You cannot delete this blog",
      });
    }

    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blogId: id });

    return res.status(200).json({ success: true, message: "Blog deleted successfully!" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const toggleLikeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const alreadyLiked = blog.likedBy.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      blog.likedBy = blog.likedBy.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    } else {
      blog.likedBy.push(req.user._id);
      await createNotification({
        userId: blog.author_id,
        actorId: req.user._id,
        actorUsername: req.user.username,
        type: "like",
        message: `${req.user.username} liked your post "${blog.title}"`,
        blogId: blog._id,
      });
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: blog.likedBy.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const toggleBookmarkBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const alreadyBookmarked = req.user.bookmarks.some(
      (blogId) => blogId.toString() === id
    );

    if (alreadyBookmarked) {
      req.user.bookmarks = req.user.bookmarks.filter((blogId) => blogId.toString() !== id);
    } else {
      req.user.bookmarks.push(blog._id);
    }

    await req.user.save();

    return res.status(200).json({
      success: true,
      bookmarked: !alreadyBookmarked,
      bookmarksCount: req.user.bookmarks.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getBookmarkedBlogs = async (req, res) => {
  try {
    await req.user.populate("bookmarks");
    const blogs = (req.user.bookmarks || [])
      .filter(Boolean)
      .map((blog) => withDerivedFields(blog, req.user))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, parentCommentId = null } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: "Comment is required" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent || parent.blogId.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "Invalid parent comment",
        });
      }
    }

    const comment = await Comment.create({
      blogId: blog._id,
      authorId: req.user._id,
      authorUsername: req.user.username,
      content: content.trim(),
      parentCommentId,
    });

    blog.commentsCount += 1;
    await blog.save();

    const type = parentCommentId ? "reply" : "comment";
    const message = parentCommentId
      ? `${req.user.username} replied on your post "${blog.title}"`
      : `${req.user.username} commented on your post "${blog.title}"`;

    await createNotification({
      userId: blog.author_id,
      actorId: req.user._id,
      actorUsername: req.user.username,
      type,
      message,
      blogId: blog._id,
      commentId: comment._id,
    });

    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getCommentsByBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ blogId: id }).sort({ createdAt: 1 });
    const data = comments.map((comment) => {
      const parsed = comment.toObject();
      parsed.likesCount = parsed.likedBy?.length || 0;
      parsed.isLiked = req.user
        ? parsed.likedBy?.some((userId) => userId.toString() === req.user._id.toString())
        : false;
      return parsed;
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const toggleLikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const alreadyLiked = comment.likedBy.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      comment.likedBy = comment.likedBy.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    } else {
      comment.likedBy.push(req.user._id);
    }

    await comment.save();

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: comment.likedBy.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const isOwner = comment.authorId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You cannot delete this comment",
      });
    }

    const relatedComments = await Comment.find({
      $or: [{ _id: comment._id }, { parentCommentId: comment._id }],
    });
    await Comment.deleteMany({
      _id: { $in: relatedComments.map((item) => item._id) },
    });

    await Blog.findByIdAndUpdate(comment.blogId, {
      $inc: { commentsCount: -relatedComments.length },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

