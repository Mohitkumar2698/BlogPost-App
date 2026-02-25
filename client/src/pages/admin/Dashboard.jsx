import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaSpinner, FaTrash, FaUsers } from "react-icons/fa";
import { BlogContext } from "../../context/BlogState";
import { UserContext } from "../../context/UserState";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Badge from "../../components/ui/badge";
import Alert from "../../components/ui/alert";
import Button from "../../components/ui/button";
import ExpandableText from "../../components/ui/expandable-text";
import { alertError, alertSuccess } from "../../utils/alerts";

const Dashboard = () => {
  const { id } = useParams();
  const fallbackAdminId = localStorage.getItem("userId");
  const adminId = id || fallbackAdminId;
  const { getRequest, deleteBlog } = useContext(BlogContext);
  const { getReports, updateReportStatus } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const isAuthorized = Boolean(username) && role === "admin";

  const metrics = useMemo(() => {
    const categoryCount = [...new Set(blogs.map((blog) => blog.category))].length;
    return {
      users: users.length,
      blogs: blogs.length,
      categories: categoryCount,
      openReports: reports.filter((report) => report.status === "open").length,
    };
  }, [blogs, users, reports]);

  const handleDeleteBlog = async (blogId) => {
    const res = await deleteBlog(blogId);
    if (!res.success) {
      alertError(res.message || "Unable to delete blog.");
      return;
    }

    alertSuccess(res.message);
    setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
  };

  const handleReportStatus = async (reportId, status) => {
    const res = await updateReportStatus(reportId, { status });
    if (!res?.success) {
      alertError(res?.message || "Unable to update report.");
      return;
    }

    setReports((prev) =>
      prev.map((report) => (report._id === reportId ? res.report : report))
    );
    alertSuccess("Report updated");
  };

  useEffect(() => {
    if (!isAuthorized) {
      setError("Unauthorized. Admin access is required.");
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      const [blogsRes, usersRes, reportsRes] = await Promise.all([
        getRequest(`admin/blogs/${adminId}`),
        getRequest(`admin/users/${adminId}`),
        getReports(),
      ]);

      if (!blogsRes?.success) {
        setError(blogsRes?.message || "Failed to load blogs.");
      } else {
        setBlogs(blogsRes.blogs || []);
      }

      if (!usersRes?.success) {
        setError(usersRes?.message || "Failed to load users.");
      } else {
        setUsers(usersRes.users || []);
      }

      if (!reportsRes?.success) {
        setError(reportsRes?.message || "Failed to load reports.");
      } else {
        setReports(reportsRes.data || []);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [adminId, isAuthorized, getRequest, getReports]);

  return (
    <>
      {!isAuthorized ? (
        <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-slate-50 to-slate-100 px-4">
          <div className="w-full max-w-xl">
            <Alert variant="error" title="Unauthorized">
              {error}{" "}
              <Link className="text-teal-700 underline" to="/login">
                Login
              </Link>{" "}
              first.
            </Alert>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-slate-50 to-slate-100">
          <FaSpinner className="animate-spin text-5xl text-teal-700" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-slate-50 to-slate-100 px-4">
          <div className="w-full max-w-xl">
            <Alert variant="error" title="Dashboard error">
              {error}
            </Alert>
          </div>
        </div>
      ) : (
        <div className="min-h-[80vh] bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 md:px-6 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 mt-2">Manage users, posts, and moderation queue</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardDescription>Total Users</CardDescription>
                  <CardTitle className="text-3xl">{metrics.users}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Total Posts</CardDescription>
                  <CardTitle className="text-3xl">{metrics.blogs}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Categories</CardDescription>
                  <CardTitle className="text-3xl">{metrics.categories}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Open Reports</CardDescription>
                  <CardTitle className="text-3xl">{metrics.openReports}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Users</CardTitle>
                  <CardDescription>Latest registered members</CardDescription>
                </div>
                <FaUsers className="text-2xl text-teal-700" />
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Username</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-slate-100">
                        <td className="py-2 pr-4 break-all">{user.username}</td>
                        <td className="py-2 pr-4 break-all">{user.email}</td>
                        <td className="py-2 pr-4">
                          <Badge>{user.role}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Moderation Queue</CardTitle>
                <CardDescription>Handle user reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {reports.length === 0 ? (
                  <p className="text-sm text-slate-500">No reports available.</p>
                ) : (
                  reports.map((report) => (
                    <div key={report._id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center gap-2">
                        <div>
                          <p className="text-sm font-semibold break-words">
                            {report.targetType.toUpperCase()} reported by @{report.reporterUsername}
                          </p>
                          <ExpandableText text={report.reason} previewChars={180} className="text-sm text-slate-600" />
                        </div>
                        <Badge>{report.status}</Badge>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReportStatus(report._id, "in_review")}
                        >
                          In Review
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleReportStatus(report._id, "resolved")}
                        >
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReportStatus(report._id, "rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {blogs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-slate-600">No posts available.</CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {blogs.map((blog) => (
                  <Card className="w-full overflow-hidden" key={blog._id}>
                    {blog.imageUrl ? (
                      <img src={blog.imageUrl} alt={blog.title} className="h-40 w-full object-cover" />
                    ) : null}
                    <CardHeader>
                      <div className="justify-between flex items-center gap-3">
                        <CardTitle className="text-2xl break-words">{blog.title}</CardTitle>
                        <div className="flex gap-2 text-lg text-teal-700">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/edit/${blog._id}`)}>
                            <FaEdit />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-rose-500"
                            onClick={() => handleDeleteBlog(blog._id)}
                          >
                            <FaTrash />
                          </Button>
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
                        className="text-gray-700 mb-6 border p-3 rounded-lg bg-gray-50"
                        preserveWhitespace
                      />
                    </CardContent>

                    <CardFooter className="flex justify-between items-start gap-2 text-sm text-gray-600">
                      <span className="break-words">
                        Category: <Badge className="ml-1 break-words whitespace-normal">{blog.category.toUpperCase()}</Badge>
                      </span>
                      <span className="break-all text-right">Author: {blog.author}</span>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
