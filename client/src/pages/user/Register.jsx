import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserState.jsx";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Select from "../../components/ui/select";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });
  const navigate = useNavigate();
  const { registerUser } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!validator.isEmail(formData.email)) {
      toast.error("Enter a valid email");
      setSubmitting(false);
      return;
    }

    const res = await registerUser(formData);

    if (res.success) {
      toast.success("Registration successful!");
      localStorage.setItem("username", res.user.username);
      localStorage.setItem("role", res.user.role); // optional persistence

      if (res.user.role === "admin")
        setTimeout(() => navigate(`/admin/${res.user._id}`), 1000);
      else setTimeout(() => navigate(`/`), 1000);
    } else {
      toast.error(res.message || "Registration failed");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-125 bg-gray-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="role" className="block text-sm mb-1 text-slate-700">
                Role
              </label>
              <Select id="role" name="role" required onChange={handleChange}>
                <option value="">Register as</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
            <div>
              <label htmlFor="username" className="block text-sm mb-1 text-slate-700">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm mb-1 text-slate-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-1 text-slate-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Register;
