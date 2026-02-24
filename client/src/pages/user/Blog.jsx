import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaHeart, FaRegHeart, FaSpinner } from "react-icons/fa";
import { BlogContext } from "../../context/BlogState";
import useFavoriteBlogs from "../../hooks/useFavoriteBlogs";
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

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const { getRequest } = useContext(BlogContext);
  const { isFavorite, toggleFavorite } = useFavoriteBlogs();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getRequest(`blogs/${id}`);
        setBlog(res.blog);
      } catch {
        setError("Failed to load blog. It might not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, getRequest]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-130 bg-gray-100">
        <FaSpinner className="animate-spin text-5xl text-teal-700" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex justify-center items-center min-h-130 bg-gray-100 px-4">
        <div className="w-full max-w-xl">
          <Alert variant="error" title="Blog unavailable">
            {error || "Blog not found"}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-125 bg-gray-100 px-6 py-8">
      <Card className="max-w-3xl mx-auto">
        <div className="mb-4 w-fit">
          <Link
            to="/"
            className="text-teal-700 hover:underline flex items-center gap-2"
          >
            <FaArrowLeft /> Back to Home
          </Link>
        </div>

        <CardHeader>
          <div className="flex justify-between items-start gap-4 mb-2">
            <CardTitle className="text-3xl">{blog.title}</CardTitle>
            <Button
              type="button"
              onClick={() => toggleFavorite(blog)}
              variant="ghost"
              size="icon"
              className="text-2xl text-rose-500"
              aria-label="Toggle favorite"
            >
              {isFavorite(blog._id) ? <FaHeart /> : <FaRegHeart />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Posted on {new Date(blog.createdAt).toDateString()}
          </p>

          <p className="text-gray-800 mb-6 border p-3 rounded bg-gray-50">
            {blog.content}
          </p>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-gray-600">
          <span>
            Category: <Badge>{blog.category.toUpperCase()}</Badge>
          </span>
          <span>Author: {blog.author.toUpperCase()}</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Blog;
