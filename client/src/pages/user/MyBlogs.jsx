import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaEdit, FaPlus, FaSpinner, FaTrash } from "react-icons/fa";
import { BlogContext } from "../../context/BlogState";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import Badge from "../../components/ui/badge";
import Alert from "../../components/ui/alert";
import ExpandableText from "../../components/ui/expandable-text";
import { alertError, alertSuccess } from "../../utils/alerts";

const MyBlog = () => {
  const { username } = useParams();
  const profileName = username;
  const { getRequest, deleteBlog: removeBlog } = useContext(BlogContext);
  const loggedInUser = localStorage.getItem("username");
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const navigate = useNavigate();

  const deleteBlog = async (id) => {
    try {
      const res = await removeBlog(id);
      if (res.success) {
        alertSuccess(res.message);
        setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      } else {
        alertError(res.message || "Unable to delete blog.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!profileName) {
        setError("Invalid user profile.");
        setLoading(false);
        return;
      }

      const res = await getRequest(profileName);
      if (!res?.success) {
        setError(res?.message || "Failed to load blogs.");
        setLoading(false);
        return;
      }

      setBlogs(res.allBlogs || []);
      setLoading(false);
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
        <div className="min-h-[80vh] bg-gradient-to-b from-slate-50 via-white to-cyan-50 px-4 md:px-6 py-8">
          <div className="w-full max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                {loggedInUser === profileName ? "My Stories" : `Stories by @${profileName}`}
              </h1>
              <p className="text-slate-600 mt-1">Manage and review published content.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {blogs.map((blog) => (
            <Card className="w-full" key={blog._id}>
              {blog.imageUrl ? (
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover rounded-t-xl" />
              ) : null}
              <CardHeader>
                <div className="mb-2 justify-between flex items-start gap-3">
                  <CardTitle className="text-3xl break-words">{blog.title}</CardTitle>
                <div className="flex gap-4 text-xl text-teal-700 shrink-0">
                    {loggedInUser === profileName ? (
                      <>
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
                      </>
                    ) : null}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Posted on {new Date(blog.createdAt).toDateString()}
              </p>

              <ExpandableText
                text={blog.content}
                previewChars={260}
                className="text-gray-800 mb-6 border p-3 rounded bg-gray-50"
                preserveWhitespace
              />
              </CardContent>

              <CardFooter className="flex justify-between items-start gap-2 text-sm text-gray-600">
                <span className="break-words">
                  Category: <Badge className="break-words whitespace-normal">{blog.category.toUpperCase()}</Badge>
                </span>
                <span className="break-all text-right">Author: {blog.author.toUpperCase()}</span>
              </CardFooter>
            </Card>
          ))}
            </div>
          {blogs.length === 0 ? (
            <div className="flex justify-center items-center h-100 w-full">
              <div className="text-red-500 text-2xl">
                {" "}
                Oops ! No Blogs Found{" "}
                <Link className="text-blue-600 underline" to={"/write"}>
                  Post new one{" "}
                </Link>
              </div>
            </div>
          ) : loggedInUser === profileName ? (
            <Link
              to={"/write"}
              className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-center items-center text-5xl text-black/50 hover:bg-slate-900 hover:text-white transition duration-200 mt-4"
            >
              <FaPlus />
            </Link>
          ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default MyBlog;

