import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBlog, FaPlus, FaSignOutAlt, FaUser } from "react-icons/fa";

const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  const username = localStorage.getItem("username");
  const profilePic = localStorage.getItem("profilePic");
  const navigate = useNavigate();

  const signOut = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <nav className="h-20 bg-teal-700 text-white px-10 flex justify-between items-center shadow-md sticky top-0 z-50">
      <div className="text-3xl font-semibold tracking-wide cursor-pointer">
        <Link
          to="/"
          className="text-shadow-teal-200 text-shadow-lg transition duration-200 underline underline-offset-5 decoration-4"
        >
          <span className="overline">BlogStory</span>
        </Link>
      </div>
      <div className="lg:w-200 px-4">
        {/* <input
          type="text"
          placeholder="Search by here"
          className="w-full h-10 px-4 rounded bg-gray-100 text-black placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-200"
        /> */}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-7 relative">
        {!username ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 border rounded hover:text-black/80 hover:bg-gray-100 hover:shadow-black/50 shadow-lg transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 border rounded hover:text-black/80 hover:bg-gray-100 hover:shadow-black/50 shadow-lg transition"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/post"
              className="px-4 py-2 border rounded flex items-center gap-2 hover:bg-gray-100 shadow-md hover:text-black/80 hover:shadow-black/50 transition duration-200"
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
                <div className="absolute right-0 mt-2 w-44 bg-white text-black border border-white/20 rounded-md shadow-lg py-2 text-smz-50">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 hover:bg-teal-700 transition hover:text-white"
                  >
                    <FaUser className="mr-2" /> Profile
                  </Link>
                  <Link
                    to={`${username}`}
                    className="flex items-center px-4 py-2 hover:bg-teal-700 transition hover:text-white"
                  >
                    <FaBlog className="mr-2" /> My Blogs
                  </Link>
                  <div
                    onClick={signOut}
                    to="/"
                    className="flex items-center px-4 py-2 hover:bg-teal-700 transition hover:text-white cursor-pointer"
                  >
                    <FaSignOutAlt className="mr-2" /> Sign Out
                  </div>
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
