import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserState";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(formData);
    if (res.success) {
      console.log(res);

      toast.success("Login successful!");
      localStorage.setItem("username", res.user.username); // optional persistence
      localStorage.setItem("role", res.user.role); // optional persistence

      if (res.user.role === "admin")
        setTimeout(() => navigate(`/admin/${res.user._id}`), 1000);
      else setTimeout(() => navigate(`/`), 1000);
    } else {
      toast.error(res.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-125 bg-gray-100 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-black p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h1 className="text-3xl text-center font-bold mb-6 underline underline-offset-8">
          Log In
        </h1>

        <div className="mb-4">
          <label htmlFor="username" className="block mb-1 text-sm">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full h-10 px-3 border rounded bg-inherit border-black/80  focus:outline-none focus:ring-2 focus:ring-teal-300"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 text-sm">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full h-10 px-3 border rounded bg-inherit border-black/80  focus:outline-none focus:ring-2 focus:ring-teal-300"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-700 hover:shadow-lg shadow-black/80 text-white py-2 rounded font-semibold transition duration-200 cursor-pointer"
        >
          Submit
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
