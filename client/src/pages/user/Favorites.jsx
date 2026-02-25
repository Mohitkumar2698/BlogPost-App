import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBookmark } from "react-icons/fa";
import { BlogContext } from "../../context/BlogState";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import Button from "../../components/ui/button";
import Badge from "../../components/ui/badge";
import Alert from "../../components/ui/alert";
import ExpandableText from "../../components/ui/expandable-text";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const { getBookmarkedBlogs, toggleBookmarkBlog } = useContext(BlogContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      const res = await getBookmarkedBlogs();
      if (!res?.success) {
        setError(res?.message || "Unable to load saved blogs.");
        return;
      }
      setFavorites(res.data || []);
    };

    loadFavorites();
  }, [getBookmarkedBlogs]);

  const removeBookmark = async (blogId) => {
    const res = await toggleBookmarkBlog(blogId);
    if (!res?.success) {
      return;
    }
    setFavorites((prev) => prev.filter((blog) => blog._id !== blogId));
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-slate-50 via-white to-cyan-50 px-4 md:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Saved Stories</h1>
        <p className="text-gray-600 mt-1">
          You have {favorites.length} saved {favorites.length === 1 ? "blog" : "blogs"}.
        </p>
      </div>

      {error ? (
        <div className="max-w-6xl mx-auto mt-8">
          <Alert variant="error" title="Failed">
            {error}
          </Alert>
        </div>
      ) : favorites.length === 0 ? (
        <div className="max-w-6xl mx-auto mt-8">
          <Alert title="No saved blogs yet.">
            <Link to="/" className="text-teal-700 underline">
              Explore blogs
            </Link>
          </Alert>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {favorites.map((blog) => (
            <Card key={blog._id} className="hover:shadow-lg transition-all overflow-hidden">
              {blog.imageUrl ? (
                <img src={blog.imageUrl} alt={blog.title} className="h-40 w-full object-cover" />
              ) : null}
              <CardHeader>
                <div className="flex justify-between items-start gap-3">
                  <CardTitle className="text-teal-800 break-words">{blog.title}</CardTitle>
                  <Button
                    type="button"
                    onClick={() => removeBookmark(blog._id)}
                    variant="ghost"
                    size="icon"
                    className="text-xl text-rose-500"
                    aria-label="Remove from favorites"
                  >
                    <FaBookmark />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-gray-700 text-sm">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <ExpandableText
                  text={blog.content}
                  previewChars={220}
                  className="text-gray-800 text-base mt-2 border p-3 rounded bg-gray-50"
                />
              </CardContent>

              <CardFooter className="flex justify-between items-start gap-2 mt-2 text-sm text-gray-600">
                <Badge className="max-w-[60%] break-words whitespace-normal">{blog.category?.toUpperCase()}</Badge>
                <span className="text-right break-all">- {blog.author?.toUpperCase()}</span>
              </CardFooter>

              <CardFooter>
                <Button className="w-full" onClick={() => navigate(`/stories/${blog._id}`)}>
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
