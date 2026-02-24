import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import useFavoriteBlogs from "../../hooks/useFavoriteBlogs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import Button from "../../components/ui/button";
import Badge from "../../components/ui/badge";
import Alert from "../../components/ui/alert";

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavoriteBlogs();
  const navigate = useNavigate();

  return (
    <div className="min-h-125 bg-gray-100 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800">Saved Blogs</h1>
        <p className="text-gray-600 mt-1">
          You have {favorites.length} saved {favorites.length === 1 ? "blog" : "blogs"}.
        </p>
      </div>

      {favorites.length === 0 ? (
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
            <Card key={blog._id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex justify-between items-start gap-3">
                  <CardTitle className="text-teal-800">{blog.title}</CardTitle>
                  <Button
                    type="button"
                    onClick={() => toggleFavorite(blog)}
                    variant="ghost"
                    size="icon"
                    className="text-xl text-rose-500"
                    aria-label="Remove from favorites"
                  >
                    <FaHeart />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
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
              </CardContent>

              <CardFooter className="flex justify-between items-center mt-2 text-sm text-gray-600">
                <Badge>
                  {blog.category?.toUpperCase()}
                </Badge>
                <span>- {blog.author?.toUpperCase()}</span>
              </CardFooter>

              <CardFooter>
                <Button
                  className="w-full"
                onClick={() => navigate(`/blogs/${blog._id}`)}
              >
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
