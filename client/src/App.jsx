import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Post from "./pages/Post";
import Error from "./pages/Error";
import Blog from "./pages/Blog";
import MyBlog from "./pages/MyBlogs";
import Edit from "./pages/Edit";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/:id" element={<MyBlog />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/*" element={<Error />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
