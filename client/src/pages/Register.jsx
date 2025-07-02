import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserState.jsx";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { registerUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(formData);

    if (res.success) {
      toast.success("Registration successful!");
      localStorage.setItem("username", formData.username);
      setTimeout(() => navigate("/"), 1000);
    } else {
      toast.error(res.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-125 bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-lg p-8 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-6 underline underline-offset-8">
          Sign Up
        </h2>

        <div className="mb-4">
          <label htmlFor="username" className="block mb-1 text-sm">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="w-full h-10 px-3 border border-black/80 bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-sm">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full h-10 px-3 border border-black/80 bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-teal-300"
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
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full h-10 px-3 border border-black/80 bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-700 hover:shadow-md shadow-black/80 text-white py-2 rounded font-semibold transition duration-200"
        >
          Submit
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Register;
