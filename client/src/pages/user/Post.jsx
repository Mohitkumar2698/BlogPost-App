import { useContext, useState } from "react";
import { FaFont, FaPager, FaTag, FaUser } from "react-icons/fa";
import { BlogContext } from "../../context/BlogState";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Post = () => {
  const { postBlog } = useContext(BlogContext);
  const username = localStorage.getItem("username");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postBlog({
        ...formData,
        author: username,
      });

      if (res.success) {
        toast.success("Blog posted successfully!");
        setFormData({ title: "", content: "", category: "" });
      } else {
        toast.error(res.message || "Failed to post blog.");
      }
    } catch (err) {
      toast.error("An error occurred while posting.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-125 p-2 bg-gray-100">
      {!username ? (
        <p className="text-2xl text-red-500">
          Oops! You aren't logged in. Please
          <Link to="/login" className=" text-blue-600 underline">
            {" "}
            Log in
          </Link>{" "}
          first.
        </p>
      ) : (
        <>
          {/* Form */}
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl shadow-xl flex flex-col lg:flex-row gap-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full lg:w-1/2 border border-black/30 rounded p-5"
            >
              <h2 className="text-3xl text-center font-semibold">
                Post New Blog
              </h2>

              <label className="flex items-center gap-2">
                <FaFont />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Title"
                  className="w-full px-3 py-2 bg-transparent rounded border border-black/30 focus:outline-none"
                />
              </label>

              <label className="flex items-center gap-2">
                <FaUser />
                <input
                  type="text"
                  value={username}
                  readOnly
                  className="w-full px-3 py-2 bg-transparent rounded border border-black/30"
                />
              </label>

              <label className="flex items-center gap-2">
                <FaTag />
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="Category"
                  className="w-full px-3 py-2 bg-transparent rounded border-black/30 focus:outline-none border"
                />
              </label>

              <label className="flex gap-2">
                <FaPager className="mt-1" />
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  placeholder="Write your content here..."
                  className="w-full h-40 resize-none p-3 bg-transparent border border-black/30 rounded focus:outline-none"
                />
              </label>

              <div className="flex gap-4 mt-3">
                <button
                  type="submit"
                  className="w-full bg-teal-700 text-white font-semibold cursor-pointer py-2 rounded hover:shadow-md shadow-black transition"
                >
                  Submit
                </button>
                <button
                  type="reset"
                  onClick={() =>
                    setFormData({ title: "", content: "", category: "" })
                  }
                  className="w-full bg-white/10 border font-semibold cursor-pointer py-2 rounded hover:shadow-black shadow-md transition"
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Preview */}
            <div className="w-full lg:w-1/2 border border-black/30 rounded p-5 flex flex-col gap-4 bg-teal-700">
              <div className="flex justify-between text-sm text-white/80">
                <span>{formData.title || "Title"}</span>
                <span>{new Date().toDateString()}</span>
              </div>
              <textarea
                readOnly
                value={formData.content}
                placeholder="Content preview..."
                className="bg-white text-black p-3 rounded h-40 resize-none"
              />
              <div className="flex justify-between text-white/50 text-sm">
                <span>{formData.category?.toUpperCase() || "CATEGORY"}</span>
                <span>- {username?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Post;
