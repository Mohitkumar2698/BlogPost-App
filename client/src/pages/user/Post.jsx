import { useContext, useEffect, useState } from "react";
import { FaFont, FaImage, FaPager, FaTag, FaUser } from "react-icons/fa";
import { BlogContext } from "../../context/BlogState";
import { Link } from "react-router-dom";
import { alertError, alertSuccess } from "../../utils/alerts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Input from "../../components/ui/input";
import Textarea from "../../components/ui/textarea";
import Button from "../../components/ui/button";
import Badge from "../../components/ui/badge";
import Alert from "../../components/ui/alert";
import { getSession } from "../../utils/session";

const Post = () => {
  const { postBlog } = useContext(BlogContext);
  const { username, isLoggedIn, isUser } = getSession();
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage") {
      setFormData((prev) => ({ ...prev, coverImage: files?.[0] || null }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await postBlog({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        coverImage: formData.coverImage,
      });

      if (res.success) {
        alertSuccess("Blog posted successfully!");
        setFormData({ title: "", content: "", category: "", coverImage: null });
      } else {
        alertError(res.message || "Failed to post blog.");
      }
    } catch {
      alertError("An error occurred while posting.");
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (!formData.coverImage) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(formData.coverImage);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.coverImage]);

  return (
    <div className="min-h-[80vh] p-4 bg-gradient-to-b from-slate-50 via-white to-cyan-50">
      {!isLoggedIn || !username || !isUser ? (
        <div className="mx-auto mt-16 max-w-2xl">
          <Alert variant="error" title="Access restricted">
            {!isLoggedIn ? (
              <>
                Please <Link to="/login" className="text-blue-600 underline">log in</Link> with a user account
                to publish posts.
              </>
            ) : (
              "This action is available for user accounts only."
            )}
          </Alert>
        </div>
      ) : (
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-4xl font-black tracking-tight">Write a Story</h1>
            <p className="text-slate-600 mt-1">Share your thoughts with cover image and detailed content.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">New Story</CardTitle>
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

                  <label className="flex items-center gap-2">
                    <FaImage />
                    <Input
                      type="file"
                      name="coverImage"
                      accept="image/*"
                      onChange={handleChange}
                      required
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
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? "Publishing..." : "Publish"}
                    </Button>
                    <Button
                      type="reset"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        setFormData({ title: "", content: "", category: "", coverImage: null })
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-700 border-0 text-white shadow-lg">
              <CardHeader>
                <div className="flex justify-between text-sm text-white/80">
                  <span>{formData.title || "Title"}</span>
                  <span>{new Date().toDateString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/80 mb-2">Live preview</p>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                ) : null}
                <Textarea
                  readOnly
                  value={formData.content}
                  placeholder="Content preview..."
                  className="bg-white text-black h-40 resize-none"
                />
                <div className="flex justify-between text-white/80 text-sm mt-4">
                  <Badge variant="secondary">
                    {formData.category?.toUpperCase() || "CATEGORY"}
                  </Badge>
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

export default Post;

