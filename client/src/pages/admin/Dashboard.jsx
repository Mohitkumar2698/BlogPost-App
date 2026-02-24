import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { BlogContext } from "../../context/BlogState";
import api from "../../utils/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Badge from "../../components/ui/badge";
import Alert from "../../components/ui/alert";

const Dashboard = () => {
  const { id } = useParams();
  const { getRequest } = useContext(BlogContext);
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const deleteBlog = async (id) => {
    try {
      const res = await api.delete(`http://localhost:4000/api/v1/${id}`);
      toast.success(res.data.message);
      navigate(0);
    } catch {
      toast.error("Unable to delete blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!username) setError("Unauthorized - Please");
    else {
      const fetchBlogs = async () => {
        try {
          const res = await getRequest(`admin/blogs/${id}`);
          setBlogs(res.blogs);
        } catch {
          setError("Failed to load blog. It might not exist.");
        } finally {
          setLoading(false);
        }
      };

      fetchBlogs();
    }
  }, [username, getRequest, id]);

  return (
    <>
      {!username ? (
        <div className="flex justify-center items-center min-h-125 bg-gray-100">
          <div className="w-full max-w-xl px-4">
            <Alert variant="error" title="Unauthorized">
              {error}{" "}
              <Link className="text-teal-700 underline" to={"/login"}>
                Login
              </Link>{" "}
              first.
            </Alert>
          </div>
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
            <p className="text-sm text-slate-600">
              Here you can control every user and blogs
            </p>
          </div>
          {blogs.map((blog, idx) => (
            <Card className="w-full lg:w-[48%]" key={idx}>
              <CardHeader>
                <div className="mb-2 justify-between flex items-center">
                  <CardTitle className="text-3xl">{blog.title}</CardTitle>
                  <div className="flex gap-4 text-xl text-teal-700">
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/edit/${blog._id}`);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="cursor-pointer text-red-500"
                      onClick={() => {
                        deleteBlog(blog._id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
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
          ))}
          <ToastContainer position="top-left" autoClose={3000} />
        </div>
      )}
    </>
  );
};

export default Dashboard;
