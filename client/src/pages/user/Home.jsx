import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart, FaSearch, FaUserPlus } from "react-icons/fa";
import { BlogContext } from "../../context/BlogState";
import { UserContext } from "../../context/UserState";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import Input from "../../components/ui/input";
import Select from "../../components/ui/select";
import Button from "../../components/ui/button";
import Badge from "../../components/ui/badge";
import Alert from "../../components/ui/alert";
import Skeleton from "../../components/ui/skeleton";
import ExpandableText from "../../components/ui/expandable-text";
import { alertError } from "../../utils/alerts";
import { getSession } from "../../utils/session";

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [feedType, setFeedType] = useState("for-you");
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [followingAuthors, setFollowingAuthors] = useState(new Set());
  const { getFeed, toggleLikeBlog, toggleBookmarkBlog, getBookmarkedBlogs } = useContext(BlogContext);
  const { toggleFollowUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { username: currentUsername, isLoggedIn, isUser } = getSession();

  const refreshBookmarks = useCallback(async () => {
    if (!isLoggedIn || !isUser) {
      setBookmarkedIds(new Set());
      return;
    }
    const res = await getBookmarkedBlogs();
    if (!res?.success) {
      return;
    }
    setBookmarkedIds(new Set((res.data || []).map((blog) => blog._id)));
  }, [getBookmarkedBlogs, isLoggedIn, isUser]);

  const refreshFeed = useCallback(async () => {
    const res = await getFeed(feedType);
    if (!res?.success) {
      setError(res?.message || "Unable to fetch blogs right now.");
      setBlogs([]);
      return;
    }
    const data = res.data || [];
    setBlogs(data);
    setFollowingAuthors(new Set(data.filter((blog) => blog.isFollowing).map((blog) => blog.author)));
    setError("");
  }, [feedType, getFeed]);

  useEffect(() => {
    refreshFeed();
  }, [refreshFeed]);

  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

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
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [blogs, searchQuery, selectedCategory, sortBy]);

  const ensureUserAction = (message) => {
    if (isLoggedIn && isUser) return true;
    alertError(message);
    navigate(isLoggedIn ? "/admin" : "/login");
    return false;
  };

  const handleLike = async (blogId) => {
    if (!ensureUserAction("Please login as user to like posts.")) return;
    const res = await toggleLikeBlog(blogId);
    if (!res?.success) {
      alertError(res?.message || "Failed to like post.");
      return;
    }
    setBlogs((prev) =>
      (prev || []).map((blog) =>
        blog._id === blogId ? { ...blog, isLiked: res.liked, likesCount: res.likesCount } : blog
      )
    );
  };

  const handleBookmark = async (blogId) => {
    if (!ensureUserAction("Please login as user to save posts.")) return;
    const res = await toggleBookmarkBlog(blogId);
    if (!res?.success) {
      alertError(res?.message || "Failed to save post.");
      return;
    }
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (res.bookmarked) next.add(blogId);
      else next.delete(blogId);
      return next;
    });
  };

  const handleFollowAuthor = async (author) => {
    if (!ensureUserAction("Please login as user to follow creators.")) return;
    const res = await toggleFollowUser(author);
    if (!res?.success) {
      alertError(res?.message || "Failed to follow user.");
      return;
    }
    setFollowingAuthors((prev) => {
      const next = new Set(prev);
      if (res.following) next.add(author);
      else next.delete(author);
      return next;
    });
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Explore Stories</h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            A social writing network for deep posts, short updates, and thoughtful discussion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          <Button variant={feedType === "for-you" ? "default" : "outline"} onClick={() => setFeedType("for-you")}>
            For You
          </Button>
          <Button
            variant={feedType === "following" ? "default" : "outline"}
            onClick={() => {
              if (!isLoggedIn) {
                alertError("Please login to view following feed.");
                navigate("/login");
                return;
              }
              setFeedType("following");
            }}
          >
            Following
          </Button>
        </div>

        <div className="grid gap-3 lg:grid-cols-4 mb-4">
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
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest">Latest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title A-Z</option>
          </Select>
        </div>

        <div className="text-sm text-gray-600 flex justify-between mb-4">
          <p>
            Showing {filteredBlogs.length} of {blogs?.length || 0} blogs
          </p>
          <p>Saved blogs: {bookmarkedIds.size}</p>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <Alert variant="error" title="Request failed">
              {error}
            </Alert>
            <div className="mt-3">
              <Button variant="outline" onClick={refreshFeed}>
                Retry
              </Button>
            </div>
          </div>
        ) : null}

        {blogs === null ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-7 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center text-lg mt-35 text-red-500">
            No blogs match your filters.{" "}
            <Link to="/write" className="text-blue-600 underline">
              Post one now!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredBlogs.map((blog) => (
                <Card key={blog._id} className="hover:shadow-md transition-all overflow-hidden border-slate-200">
                  {blog.imageUrl ? (
                    <img src={blog.imageUrl} alt={blog.title} className="h-52 w-full object-cover" />
                  ) : null}
                  <CardHeader className="min-w-0">
                    <CardTitle className="text-slate-900 text-xl leading-tight break-words">{blog.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 pt-0">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span>{blog.likesCount || 0} likes</span>
                    </div>
                    <ExpandableText text={blog.content} previewChars={220} className="text-gray-700 text-sm" />
                  </CardContent>
                  <CardFooter className="flex justify-between items-start gap-2 text-sm text-gray-600">
                    <Badge className="max-w-[60%] break-words whitespace-normal">{blog.category?.toUpperCase()}</Badge>
                    <span className="text-right break-all">@{blog.author}</span>
                  </CardFooter>
                  <CardFooter className="flex gap-2 pt-0">
                    {isUser ? (
                      <>
                        <Button
                          variant={blog.isLiked ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => handleLike(blog._id)}
                        >
                          {blog.isLiked ? <FaHeart /> : <FaRegHeart />} Like
                        </Button>
                        <Button
                          variant={bookmarkedIds.has(blog._id) ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => handleBookmark(blog._id)}
                        >
                          {bookmarkedIds.has(blog._id) ? <FaBookmark /> : <FaRegBookmark />} Save
                        </Button>
                      </>
                    ) : (
                      <Button className="flex-1" onClick={() => navigate(`/stories/${blog._id}`)}>
                        Read
                      </Button>
                    )}
                  </CardFooter>
                  <CardFooter className="flex gap-2">
                    {isUser && currentUsername && currentUsername !== blog.author ? (
                      <Button
                        variant={followingAuthors.has(blog.author) ? "secondary" : "outline"}
                        className="flex-1"
                        onClick={() => handleFollowAuthor(blog.author)}
                      >
                        <FaUserPlus /> {followingAuthors.has(blog.author) ? "Following" : "Follow"}
                      </Button>
                    ) : null}
                    <Button className="flex-1" onClick={() => navigate(`/stories/${blog._id}`)}>
                      View
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <aside className="hidden xl:block">
              <Card className="sticky top-24 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Daily Brief</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <p>Top categories: {categories.slice(0, 3).join(", ") || "General"}</p>
                  <p>Writers active today: {new Set((blogs || []).map((item) => item.author)).size}</p>
                  <p>Switch between For You and Following to control your timeline.</p>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

