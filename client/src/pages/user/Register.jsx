import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserState.jsx";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
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

    if (!validator.isEmail(formData.email)) {
      toast.error("Enter a valid email");
      return;
    }

    const res = await registerUser(formData);

    if (res.success) {
      toast.success("Registration successful!");
      console.log(res);

      localStorage.setItem("username", res.user.username);
      localStorage.setItem("role", res.user.role); // optional persistence

      if (res.user.role === "admin")
        setTimeout(() => navigate(`/admin/${res.user._id}`), 1000);
      else setTimeout(() => navigate(`/`), 1000);
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
        <div className="mb-2">
          <label htmlFor="email" className="block text-sm">
            Role
          </label>
          <select
            id="role"
            name="role"
            required
            onChange={handleChange}
            className="w-full h-10 px-2 bg-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-black/80"
          >
            <option value="">Register as</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="username" className="block text-sm">
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
        <div className="mb-2">
          <label htmlFor="email" className="block text-sm">
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
          <label htmlFor="password" className="block text-sm">
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
