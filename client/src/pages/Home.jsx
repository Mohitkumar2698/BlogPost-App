import { useContext, useEffect, useState } from "react";
import { BlogContext } from "../context/BlogState";
import { Link, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const { getRequest } = useContext(BlogContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getRequest("blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setBlogs([]);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-125 bg-gray-100 px-6 py-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800">Latest Blogs</h1>
        <p className="text-gray-600 mt-2">
          Browse community articles and stories
        </p>
      </div>
      {blogs === null ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-5xl text-teal-700" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-lg mt-35 text-red-500">
          No blogs available.{" "}
          <Link to="/post" className="text-blue-600 underline">
            Post one now!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg transition-all p-5 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold text-teal-800">
                  {blog.title}
                </h2>
                <p className="text-gray-700 text-sm">
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-800 text-base mt-2 line-clamp-4 border p-3 rounded bg-gray-50">
                  {blog.content}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                  {blog.category.toUpperCase()}
                </span>
                <span>- {blog.author.toUpperCase()}</span>
              </div>

              <button
                onClick={() => navigate(`/blogs/${blog._id}`)}
                className="mt-4 bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 transition"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
