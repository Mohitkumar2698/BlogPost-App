import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCommentDots,
  FaHeart,
  FaRegBookmark,
  FaRegHeart,
  FaReply,
  FaSpinner,
} from "react-icons/fa";
import { BlogContext } from "../../context/BlogState";
import { UserContext } from "../../context/UserState";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Button from "../../components/ui/button";
import Badge from "../../components/ui/badge";
import Alert from "../../components/ui/alert";
import Textarea from "../../components/ui/textarea";
import ExpandableText from "../../components/ui/expandable-text";
import { alertError, alertSuccess } from "../../utils/alerts";

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [replyParent, setReplyParent] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const {
    getRequest,
    getComments,
    addComment,
    toggleLikeBlog,
    toggleBookmarkBlog,
    toggleLikeComment,
    deleteComment,
  } = useContext(BlogContext);
  const { createReport } = useContext(UserContext);
  const currentUsername = localStorage.getItem("username");

  const commentsTree = useMemo(() => {
    const map = new Map();
    comments.forEach((comment) => {
      map.set(comment._id, { ...comment, replies: [] });
    });

    const roots = [];
    map.forEach((comment) => {
      if (comment.parentCommentId && map.has(comment.parentCommentId)) {
        map.get(comment.parentCommentId).replies.push(comment);
      } else {
        roots.push(comment);
      }
    });

    return roots;
  }, [comments]);

  const fetchBlogData = useCallback(async () => {
    const [blogRes, commentsRes] = await Promise.all([
      getRequest(`blogs/${id}`),
      getComments(id),
    ]);

    if (!blogRes?.success) {
      setError(blogRes?.message || "Failed to load blog.");
      setLoading(false);
      return;
    }

    setBlog(blogRes.blog);
    setComments(commentsRes?.data || []);
    setLoading(false);
  }, [getComments, getRequest, id]);

  useEffect(() => {
    fetchBlogData();
  }, [fetchBlogData]);

  const handleBlogLike = async () => {
    const res = await toggleLikeBlog(blog._id);
    if (!res?.success) {
      alertError(res?.message || "Unable to like post.");
      return;
    }
    setBlog((prev) => ({
      ...prev,
      isLiked: res.liked,
      likesCount: res.likesCount,
    }));
  };

  const handleBlogBookmark = async () => {
    const res = await toggleBookmarkBlog(blog._id);
    if (!res?.success) {
      alertError(res?.message || "Unable to save post.");
      return;
    }
    alertSuccess(res.bookmarked ? "Saved post" : "Removed from saved posts");
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      alertError("Please write a comment.");
      return;
    }

    const res = await addComment(id, {
      content: commentText,
      parentCommentId: replyParent,
    });
    if (!res?.success) {
      alertError(res?.message || "Unable to comment.");
      return;
    }

    setCommentText("");
    setReplyParent(null);
    await fetchBlogData();
  };

  const handleCommentLike = async (commentId) => {
    const res = await toggleLikeComment(commentId);
    if (!res?.success) {
      alertError(res?.message || "Unable to like comment.");
      return;
    }

    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId
          ? { ...comment, isLiked: res.liked, likesCount: res.likesCount }
          : comment
      )
    );
  };

  const handleDeleteComment = async (commentId) => {
    const res = await deleteComment(commentId);
    if (!res?.success) {
      alertError(res?.message || "Unable to delete comment.");
      return;
    }

    setComments((prev) =>
      prev.filter((comment) => comment._id !== commentId && comment.parentCommentId !== commentId)
    );
  };

  const handleReportBlog = async () => {
    if (!reportReason.trim()) {
      alertError("Add a report reason.");
      return;
    }

    const res = await createReport({
      targetType: "blog",
      targetId: blog._id,
      reason: reportReason,
    });
    if (!res?.success) {
      alertError(res?.message || "Unable to report post.");
      return;
    }
    setReportReason("");
    alertSuccess("Report submitted");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-100">
        <FaSpinner className="animate-spin text-5xl text-teal-700" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-100 px-4">
        <div className="w-full max-w-xl">
          <Alert variant="error" title="Blog unavailable">
            {error || "Blog not found"}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-emerald-50 via-white to-cyan-50 px-6 py-8">
      <Card className="max-w-4xl mx-auto overflow-hidden">
        {blog.imageUrl ? (
          <img src={blog.imageUrl} alt={blog.title} className="h-72 w-full object-cover" />
        ) : null}
        <div className="p-6">
          <div className="mb-4 w-fit">
            <Link to="/explore" className="text-teal-700 hover:underline flex items-center gap-2">
              <FaArrowLeft /> Back to Home
            </Link>
          </div>

          <CardHeader className="px-0">
            <div className="flex justify-between items-start gap-4 mb-2">
              <CardTitle className="text-3xl break-words">{blog.title}</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handleBlogLike} variant={blog.isLiked ? "default" : "outline"} size="sm">
                  {blog.isLiked ? <FaHeart /> : <FaRegHeart />} {blog.likesCount || 0}
                </Button>
                <Button onClick={handleBlogBookmark} variant="outline" size="sm">
                  <FaRegBookmark />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <p className="text-sm text-gray-500 mb-4">
              Posted on {new Date(blog.createdAt).toDateString()}
            </p>
            <p className="text-gray-800 mb-6 border p-4 rounded bg-gray-50 whitespace-pre-wrap break-words">
              {blog.content}
            </p>
          </CardContent>

          <CardFooter className="px-0 flex justify-between items-start gap-2 text-sm text-gray-600">
            <span>
              Category: <Badge className="break-words whitespace-normal">{blog.category.toUpperCase()}</Badge>
            </span>
            <span className="break-all text-right">Author: @{blog.author}</span>
          </CardFooter>

          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <FaCommentDots /> Comments
            </h3>
            <div className="space-y-2">
              <Textarea
                placeholder={replyParent ? "Write a reply..." : "Write a comment..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              {replyParent ? (
                <Button variant="ghost" onClick={() => setReplyParent(null)}>
                  Cancel reply
                </Button>
              ) : null}
              <Button onClick={handleSubmitComment}>
                {replyParent ? "Reply" : "Add Comment"}
              </Button>
            </div>

            <div className="space-y-3 mt-6">
              {commentsTree.length === 0 ? (
                <p className="text-sm text-slate-500">No comments yet.</p>
              ) : (
                commentsTree.map((comment) => (
                  <div key={comment._id} className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="text-sm font-semibold">@{comment.authorUsername}</p>
                        <ExpandableText
                          text={comment.content}
                          previewChars={220}
                          className="text-sm text-slate-700 mt-1"
                          preserveWhitespace
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={comment.isLiked ? "default" : "outline"}
                          onClick={() => handleCommentLike(comment._id)}
                        >
                          <FaHeart /> {comment.likesCount || 0}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReplyParent(comment._id)}
                        >
                          <FaReply />
                        </Button>
                        {comment.authorUsername === currentUsername ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    {comment.replies?.length ? (
                      <div className="ml-6 mt-3 space-y-2 border-l pl-3">
                        {comment.replies.map((reply) => (
                          <div key={reply._id} className="bg-slate-50 rounded p-2">
                            <p className="text-xs font-semibold">@{reply.authorUsername}</p>
                            <ExpandableText text={reply.content} previewChars={180} className="text-sm" preserveWhitespace />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Report this post</h3>
            <Textarea
              placeholder="Explain why this post should be reviewed"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <Button className="mt-2" variant="outline" onClick={handleReportBlog}>
              Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Blog;
