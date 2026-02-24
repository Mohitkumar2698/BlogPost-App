import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaEdit, FaPlus, FaSpinner, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { BlogContext } from "../../context/BlogState";
import api from "../../utils/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import Badge from "../../components/ui/badge";
import Alert from "../../components/ui/alert";

const MyBlog = () => {
  const { username, id } = useParams();
  const profileName = username || id;
  const { getRequest } = useContext(BlogContext);
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
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
    const fetchBlogs = async () => {
      try {
        const res = await getRequest(profileName);
        setBlogs(res.allBlogs);
      } catch {
        setError("Failed to load blog. It might not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [profileName, getRequest]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-125 bg-gray-100">
          <FaSpinner className="animate-spin text-5xl text-teal-700" />
        </div>
      ) : error || !blogs ? (
        <div className="flex justify-center items-center min-h-125 bg-gray-100 px-4">
          <div className="w-full max-w-xl">
            <Alert variant="error" title="Unable to load blogs">
              {error} <Link to={"/login"} className="underline">Login</Link>
            </Alert>
          </div>
        </div>
      ) : (
        <div className="min-h-125 bg-gray-100 px-6 py-8 gap-4 flex-wrap flex">
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
          {blogs.length === 0 ? (
            <div className="flex justify-center items-center h-100 w-full">
              <div className="text-red-500 text-2xl">
                {" "}
                Oops ! No Blogs Found{" "}
                <Link className="text-blue-600 underline" to={"/post"}>
                  Post new one{" "}
                </Link>
              </div>
            </div>
          ) : (
            <Link
              to={"/post"}
              className="w-full lg:w-[48%] bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-center items-center text-5xl text-black/50 hover:bg-teal-700 hover:text-white transition duration-200"
            >
              <FaPlus />
            </Link>
          )}
          <ToastContainer position="top-left" autoClose={3000} />
        </div>
      )}
    </>
  );
};

export default MyBlog;

