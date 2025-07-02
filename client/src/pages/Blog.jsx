import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { BlogContext } from "../context/BlogState";

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const { getRequest } = useContext(BlogContext);

  const fetchBlog = async () => {
    try {
      const res = await getRequest(`blogs/${id}`);
      setBlog(res.blog);
    } catch (err) {
      setError("Failed to load blog. It might not exist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-130 bg-gray-100">
        <FaSpinner className="animate-spin text-5xl text-teal-700" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex justify-center items-center min-h-130 bg-gray-100">
        <p className="text-xl text-red-500">{error || "Blog not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-125 bg-gray-100 px-6 py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow-md">
        <div className="mb-4 w-fit">
          <Link
            to="/"
            className="text-teal-700 hover:underline flex items-center gap-2"
          >
            <FaArrowLeft /> Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-slate-800">{blog.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          Posted on {new Date(blog.createdAt).toDateString()}
        </p>

        <p className="text-gray-800 mb-6 border p-3 rounded bg-gray-50">
          {blog.content}
        </p>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Category: {blog.category.toUpperCase()}</span>
          <span>Author: {blog.author.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default Blog;
