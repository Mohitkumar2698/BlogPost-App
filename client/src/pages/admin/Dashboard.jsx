import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaEdit, FaPlus, FaSpinner, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { BlogContext } from "../../context/BlogState";
import api from "../../utils/api";
import Login from "../user/Login";

const Dashboard = () => {
  const { id } = useParams();
  const { getRequest } = useContext(BlogContext);
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [getData, setGetData] = useState("blogs");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await getRequest(`admin/blogs/${id}`);
      console.log(res.blogs);
      setBlogs(res.blogs);
    } catch (err) {
      setError("Failed to load blog. It might not exist.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const res = await api.delete(`http://localhost:4000/api/v1/${id}`);
      toast.success(res.data.message);
      navigate(0);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!username) setError("Unauthorized - Please");
    else fetchBlogs();
  }, []);

  return (
    <>
      {!username ? (
        <div className="flex justify-center items-center min-h-125 bg-gray-100">
          <p className=" text-red-500 text-2xl">
            {error}{" "}
            <Link className="text-teal-700 underline" to={"/login"}>
              Login
            </Link>{" "}
            first
          </p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center min-h-125 bg-gray-100">
          <FaSpinner className="animate-spin text-5xl text-teal-700" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-125 bg-gray-100">
          <p className=" text-red-500">{error}</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex justify-center items-center h-125 w-full bg-gray-100">
          <div className="text-red-500 text-xl">0 Blogs Found </div>
        </div>
      ) : (
        <div className="min-h-125 bg-gray-100 px-6 py-8 gap-4 flex-wrap flex">
          <div className="text-black w-full text-center">
            <h1 className="text-4xl font-bold text-slate-800">
              Welcome Admin <span className="text-teal-700">{username}</span>
            </h1>
            <p className="text-[0.9rem">
              Here you can control every user and blogs
            </p>
          </div>
          {blogs.map((blog, idx) => (
            <div className="w-160  bg-white p-6 rounded shadow-md" key={idx}>
              <div className="mb-4 justify-between flex items-center">
                <h1 className="text-3xl font-bold mb-2 text-slate-800">
                  {blog.title}
                </h1>
                <div className="flex gap-4 text-xl text-teal-700">
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/edit/${blog._id}`);
                    }}
                  >
                    <FaEdit />
                  </span>
                  <span
                    className="cursor-pointer text-red-500"
                    onClick={() => {
                      deleteBlog(blog._id);
                    }}
                  >
                    <FaTrash />
                  </span>
                </div>
              </div>
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
          ))}
          <ToastContainer position="top-left" autoClose={3000} />
        </div>
      )}
    </>
  );
};

export default Dashboard;
