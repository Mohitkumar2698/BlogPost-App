import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBlog, FaHeart, FaPlus, FaSignOutAlt, FaUser } from "react-icons/fa";
import useFavoriteBlogs from "../hooks/useFavoriteBlogs";
import Badge from "./ui/badge";

const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  const username = localStorage.getItem("username");
  const profilePic = localStorage.getItem("profilePic");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const { totalFavorites } = useFavoriteBlogs();

  const signOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md transition ${isActive ? "bg-white text-teal-800" : "hover:bg-teal-600"}`;

  return (
    <nav className="sticky top-0 z-50 bg-teal-700 text-white px-4 md:px-8 h-20 flex justify-between items-center shadow-md">
      <div className="text-2xl md:text-3xl font-semibold tracking-wide cursor-pointer">
        <Link
          to="/"
          className="transition hover:opacity-90"
        >
          <span>BlogStory</span>
        </Link>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-4 relative">
        <NavLink
          to="/favorites"
          className={linkClass}
        >
          <FaHeart className="inline mr-1" />
          <span className="hidden sm:inline">Saved</span>
          <Badge className="ml-1">{totalFavorites}</Badge>
        </NavLink>
        {!username ? (
          <>
            <NavLink
              to="/login"
              className={linkClass}
            >
              Sign In
            </NavLink>
            <NavLink
              to="/register"
              className={linkClass}
            >
              Sign Up
            </NavLink>
          </>
        ) : (
          <>
            <Link
              to="/post"
              className={`${
                role ? "hidden" : "hidden md:inline-flex"
              } px-3 py-2 rounded-md items-center gap-2 hover:bg-teal-600 transition`}
            >
              <FaPlus />
              Post
            </Link>

            {/* User avatar */}
            <div className="relative">
              <div
                tabIndex={0}
                onFocus={() => setClicked(true)}
                onBlur={() =>
                  setTimeout(() => {
                    setClicked(false);
                  }, 500)
                }
                className="w-12 h-12 rounded-full border text-2xl flex items-center justify-center bg-gray-100 shadow-md text-black/80 hover:shadow-black/50  transition duration-200 cursor-pointer"
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  username.charAt(0).toUpperCase()
                )}
              </div>

              {/* Dropdown menu */}
                {clicked && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-black border border-slate-200 rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 hover:bg-teal-700 transition hover:text-white"
                  >
                    <FaUser className="mr-2" /> Profile
                  </Link>
                  <Link
                    to={`/u/${username}`}
                    className={`${
                      role ? "hidden" : "block"
                    } flex items-center px-4 py-2 hover:bg-teal-700 transition hover:text-white`}
                  >
                    <FaBlog className="mr-2" /> My Blogs
                  </Link>
                  <button
                    onClick={signOut}
                    className="w-full text-left flex items-center px-4 py-2 hover:bg-teal-700 transition hover:text-white cursor-pointer"
                  >
                    <FaSignOutAlt className="mr-2" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
