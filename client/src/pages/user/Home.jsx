import { useContext, useEffect, useMemo, useState } from "react";
import { BlogContext } from "../../context/BlogState";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import useFavoriteBlogs from "../../hooks/useFavoriteBlogs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import Input from "../../components/ui/input";
import Select from "../../components/ui/select";
import Button from "../../components/ui/button";
import Badge from "../../components/ui/badge";
import Alert from "../../components/ui/alert";
import Skeleton from "../../components/ui/skeleton";

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const { getRequest } = useContext(BlogContext);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, totalFavorites } = useFavoriteBlogs();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getRequest("blogs");
        setBlogs(res?.data || []);
        setError("");
      } catch {
        setError("Unable to fetch blogs right now.");
        setBlogs([]);
      }
    };
    fetchBlogs();
  }, [getRequest]);

  const categories = useMemo(() => {
    if (!blogs?.length) return [];
    return [...new Set(blogs.map((blog) => blog.category))].filter(Boolean);
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    if (!blogs?.length) return [];

    const query = searchQuery.trim().toLowerCase();
    const searched = blogs.filter((blog) => {
      if (!query) return true;
      return (
        blog.title?.toLowerCase().includes(query) ||
        blog.content?.toLowerCase().includes(query) ||
        blog.author?.toLowerCase().includes(query) ||
        blog.category?.toLowerCase().includes(query)
      );
    });

    const byCategory =
      selectedCategory === "all"
        ? searched
        : searched.filter((blog) => blog.category === selectedCategory);

    return [...byCategory].sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [blogs, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-125 bg-gray-100 px-6 py-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800">Latest Blogs</h1>
        <p className="text-gray-600 mt-2">
          Browse community articles and stories
        </p>
      </div>
      <div className="max-w-6xl mx-auto mt-6 grid gap-3 lg:grid-cols-4">
        <label className="lg:col-span-2 bg-white border border-gray-300 rounded-md px-3 py-2 flex items-center gap-2">
          <FaSearch className="text-gray-500" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, content, author, or category"
            className="border-0 ring-0 focus:ring-0 h-auto p-0"
          />
        </label>

        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A-Z</option>
        </Select>
      </div>
      <div className="max-w-6xl mx-auto mt-3 text-sm text-gray-600 flex justify-between">
        <p>
          Showing {filteredBlogs.length} of {blogs?.length || 0} blogs
        </p>
        <p>Saved blogs: {totalFavorites}</p>
      </div>
      {error ? (
        <div className="max-w-6xl mx-auto mt-4">
          <Alert variant="error" title="Request failed">
            {error}
          </Alert>
        </div>
      ) : null}
      {blogs === null ? (
        <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-7 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center text-lg mt-35 text-red-500">
          No blogs match your filters.{" "}
          <Link to="/post" className="text-blue-600 underline">
            Post one now!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
          {filteredBlogs.map((blog) => (
            <Card key={blog._id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex justify-between items-start gap-3">
                  <CardTitle className="text-teal-800">{blog.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(blog)}
                    className="text-xl text-rose-500"
                    aria-label="Toggle favorite"
                  >
                    {isFavorite(blog._id) ? <FaHeart /> : <FaRegHeart />}
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
                  {blog.category.toUpperCase()}
                </Badge>
                <span>- {blog.author.toUpperCase()}</span>
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

export default Home;

