import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBookmark,
  FaCompass,
  FaMoon,
  FaPenFancy,
  FaSignOutAlt,
  FaSun,
  FaUser,
} from "react-icons/fa";
import { UserContext } from "../context/UserState";
import { BlogContext } from "../context/BlogState";
import { clearSession, getSession } from "../utils/session";
import { applyTheme, getPreferredTheme } from "../utils/theme";
import Badge from "./ui/badge";
import Button from "./ui/button";

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-full text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100"
  }`;

const Navbar = () => {
  const session = getSession();
  const { username, profilePic, userId, isUser, isLoggedIn, isAdmin } = session;
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [theme, setTheme] = useState(() => getPreferredTheme());
  const navigate = useNavigate();
  const { getNotifications, logoutUser } = useContext(UserContext);
  const { getBookmarkedBlogs } = useContext(BlogContext);

  useEffect(() => {
    const hydrateTopbarCounters = async () => {
      if (!isLoggedIn) {
        setUnreadCount(0);
        setSavedCount(0);
        return;
      }

      const notificationRes = await getNotifications();
      if (notificationRes?.success) {
        setUnreadCount(notificationRes.unreadCount || 0);
      }

      if (isUser) {
        const bookmarkRes = await getBookmarkedBlogs();
        if (bookmarkRes?.success) {
          setSavedCount((bookmarkRes.data || []).length);
        }
      }
    };

    hydrateTopbarCounters();
  }, [getBookmarkedBlogs, getNotifications, isLoggedIn, isUser]);

  const handleSignOut = async () => {
    await logoutUser();
    clearSession();
    navigate("/login");
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            DevPost
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              <FaCompass className="inline mr-2" />
              Explore
            </NavLink>
            {isUser ? (
              <NavLink to="/write" className={navLinkClass}>
                <FaPenFancy className="inline mr-2" />
                Write
              </NavLink>
            ) : null}
            {isUser ? (
              <NavLink to="/saved" className={navLinkClass}>
                <FaBookmark className="inline mr-2" />
                Saved
                <Badge className="ml-2 bg-slate-200 text-slate-800">{savedCount}</Badge>
              </NavLink>
            ) : null}
            {isLoggedIn ? (
              <NavLink to="/alerts" className={navLinkClass}>
                <FaBell className="inline mr-2" />
                Alerts
                <Badge className="ml-2 bg-amber-100 text-amber-700">{unreadCount}</Badge>
              </NavLink>
            ) : null}
          </nav>
        </div>

        {!isLoggedIn ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </Button>
            <Button variant="outline" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/register")}>Get Started</Button>
          </div>
        ) : (
          <div className="relative flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 180)}
              className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center dark:border-slate-700 dark:bg-slate-800"
            >
              {profilePic ? (
                <img src={profilePic} alt={username} className="h-full w-full object-cover" />
              ) : (
                <span className="font-semibold text-slate-800 dark:text-slate-100">{username?.charAt(0).toUpperCase()}</span>
              )}
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-10 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-lg p-2 dark:border-slate-700 dark:bg-slate-900">
                <Link to="/me" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
                  <FaUser /> Profile
                </Link>
                {isUser ? (
                  <Link
                    to={`/u/${username}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    <FaPenFancy /> My Stories
                  </Link>
                ) : null}
                {isAdmin ? (
                  <Link
                    to={userId ? `/admin/${userId}` : "/admin"}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    <FaCompass /> Admin Workspace
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
