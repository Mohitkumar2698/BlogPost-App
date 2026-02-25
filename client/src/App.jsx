import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/user/Home";
import Footer from "./components/Footer";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import Profile from "./pages/user/Profile";
import Post from "./pages/user/Post";
import Error from "./pages/user/Error";
import Blog from "./pages/user/Blog";
import MyBlog from "./pages/user/MyBlogs";
import Edit from "./pages/user/Edit";
import Dashboard from "./pages/admin/Dashboard";
import Favorites from "./pages/user/Favorites";
import Notifications from "./pages/user/Notifications";
import { RequireAdmin, RequireAuth, RequireUser } from "./components/guards/RouteGuards";
import { UserContext } from "./context/UserState";
import { clearSession, getSession, saveSession } from "./utils/session";

const App = () => {
  const { getCurrentUser } = useContext(UserContext);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const hydrateSession = async () => {
      const localSession = getSession();
      if (!localSession.token) {
        clearSession();
        setAuthReady(true);
        return;
      }

      const res = await getCurrentUser();
      if (!res?.success || !res?.user) {
        clearSession();
        setAuthReady(true);
        return;
      }

      saveSession({ user: res.user, token: localSession.token });
      setAuthReady(true);
    };

    hydrateSession();
  }, [getCurrentUser]);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
        Verifying session...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Home />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <Dashboard />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/:id"
              element={
                <RequireAdmin>
                  <Dashboard />
                </RequireAdmin>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/sign" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/write"
              element={
                <RequireUser>
                  <Post />
                </RequireUser>
              }
            />
            <Route
              path="/post"
              element={
                <RequireUser>
                  <Post />
                </RequireUser>
              }
            />
            <Route
              path="/me"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route path="/stories/:id" element={<Blog />} />
            <Route path="/blogs/:id" element={<Blog />} />
            <Route
              path="/saved"
              element={
                <RequireAuth>
                  <Favorites />
                </RequireAuth>
              }
            />
            <Route
              path="/favorites"
              element={
                <RequireAuth>
                  <Favorites />
                </RequireAuth>
              }
            />
            <Route
              path="/alerts"
              element={
                <RequireAuth>
                  <Notifications />
                </RequireAuth>
              }
            />
            <Route
              path="/notifications"
              element={
                <RequireAuth>
                  <Notifications />
                </RequireAuth>
              }
            />
            <Route
              path="/u/:username"
              element={
                <RequireAuth>
                  <MyBlog />
                </RequireAuth>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <RequireAuth>
                  <Edit />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
