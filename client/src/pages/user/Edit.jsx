import { useContext, useEffect, useState } from "react";
import { FaFont, FaImage, FaPager, FaSpinner, FaTag, FaUser } from "react-icons/fa";
import { BlogContext } from "../../context/BlogState";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Input from "../../components/ui/input";
import Textarea from "../../components/ui/textarea";
import Button from "../../components/ui/button";
import Badge from "../../components/ui/badge";
import Alert from "../../components/ui/alert";
import { alertError, alertSuccess } from "../../utils/alerts";

const Edit = () => {
  const { editBlog, getRequest } = useContext(BlogContext);
  const username = localStorage.getItem("username");
  const { id } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    coverImage: null,
    existingImage: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage") {
      const file = files?.[0] || null;
      setFormData((prev) => ({ ...prev, coverImage: file }));
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await getRequest(`blogs/${id}`);
      if (!res?.success || !res?.blog) {
        setError(res?.message || "Unable to load blog details.");
        setLoading(false);
        return;
      }

      setFormData({
        title: res.blog.title || "",
        content: res.blog.content || "",
        category: res.blog.category || "",
        coverImage: null,
        existingImage: res.blog.imageUrl || "",
      });
      setPreviewUrl(res.blog.imageUrl || "");
      setLoading(false);
    };

    fetchBlog();
  }, [id, getRequest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await editBlog(id, {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        coverImage: formData.coverImage,
      });

      if (res.success) {
        alertSuccess("Blog edited successfully!");
        navigate(`/u/${username}`);
      } else {
        alertError(res.message || "Failed to edit blog.");
      }
    } catch {
      alertError("An error occurred while posting.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] p-4 bg-gradient-to-b from-slate-50 via-white to-cyan-50">
      {!username ? (
        <p className="text-2xl text-red-500">
          Oops! You aren't logged in. Please
          <Link to="/login" className=" text-blue-600 underline">
            {" "}
            Log in
          </Link>{" "}
          first.
        </p>
      ) : loading ? (
        <div className="flex justify-center items-center min-h-[80vh] bg-transparent">
          <FaSpinner className="animate-spin text-5xl text-teal-700" />
        </div>
      ) : error ? (
        <div className="w-full max-w-xl px-4">
          <Alert variant="error" title="Unable to edit">
            {error}
          </Alert>
        </div>
      ) : (
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-4xl font-black tracking-tight">Edit Story</h1>
            <p className="text-slate-600 mt-1">Update your content, category, and cover image.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Story Editor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-center gap-2">
                    <FaFont />
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
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
                      placeholder="Category"
                    />
                  </label>

                  <label className="flex items-center gap-2">
                    <FaImage />
                    <Input
                      type="file"
                      name="coverImage"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </label>

                  <label className="flex gap-2">
                    <FaPager className="mt-1" />
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Write your content here..."
                      className="h-40 resize-none"
                    />
                  </label>

                  <div className="flex gap-3 mt-3">
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Updating..." : "Update Blog"}
                    </Button>
                    <Button
                      type="reset"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          title: "",
                          content: "",
                          category: "",
                          coverImage: null,
                        }))
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-700 border-0 text-white">
              <CardHeader>
                <div className="flex justify-between text-sm text-white/80">
                  <span>{formData.title || "Title"}</span>
                  <span>{new Date().toDateString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded mb-3" />
                ) : null}
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
        </div>
      )}
    </div>
  );
};

export default Edit;

