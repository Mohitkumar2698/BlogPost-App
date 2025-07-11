import React from "react";
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
import SignUp from "./pages/user/SignUp";
import Dashboard from "./pages/admin/Dashboard";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/:id" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sign" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<Post />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/:id" element={<MyBlog />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
