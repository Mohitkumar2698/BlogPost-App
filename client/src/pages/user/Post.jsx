import { useContext, useState } from "react";
import { FaFont, FaPager, FaTag, FaUser } from "react-icons/fa";
import { BlogContext } from "../../context/BlogState";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Input from "../../components/ui/input";
import Textarea from "../../components/ui/textarea";
import Button from "../../components/ui/button";
import Badge from "../../components/ui/badge";

const Post = () => {
  const { postBlog } = useContext(BlogContext);
  const username = localStorage.getItem("username");
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
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
    } catch {
      toast.error("An error occurred while posting.");
    }
    setSubmitting(false);
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
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Post New Blog</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-center gap-2">
                    <FaFont />
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Title"
                    />
                  </label>

                  <label className="flex items-center gap-2">
                    <FaUser />
                    <Input type="text" value={username} readOnly />
                  </label>

                  <label className="flex items-center gap-2">
                    <FaTag />
                    <Input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      placeholder="Category"
                    />
                  </label>

                  <label className="flex gap-2">
                    <FaPager className="mt-1" />
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      required
                      placeholder="Write your content here..."
                      className="h-40 resize-none"
                    />
                  </label>

                  <div className="flex gap-3 mt-3">
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Publishing..." : "Publish"}
                    </Button>
                    <Button
                      type="reset"
                      variant="outline"
                      className="w-full"
                      onClick={() => setFormData({ title: "", content: "", category: "" })}
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>

            <Card className="bg-teal-700 border-teal-700 text-white">
              <CardHeader>
                <div className="flex justify-between text-sm text-white/80">
                  <span>{formData.title || "Title"}</span>
                  <span>{new Date().toDateString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={formData.content}
                  placeholder="Content preview..."
                  className="bg-white text-black h-40 resize-none"
                />
                <div className="flex justify-between text-white/80 text-sm mt-4">
                  <Badge variant="secondary">{formData.category?.toUpperCase() || "CATEGORY"}</Badge>
                  <span>- {username?.toUpperCase()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Post;

