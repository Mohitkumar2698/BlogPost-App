import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserState.jsx";
import { useNavigate } from "react-router-dom";
import { alertError, alertSuccess } from "../../utils/alerts";
import validator from "validator";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { saveSession } from "../../utils/session";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
      alertError("Enter a valid email");
      setSubmitting(false);
      return;
    }

    const res = await registerUser(formData);

    if (res.success) {
      alertSuccess("Registration successful!");
      saveSession({ user: res.user, token: res.token });

      if (res.user.role === "admin")
        setTimeout(() => navigate(`/admin/${res.user._id}`), 1000);
      else setTimeout(() => navigate(`/`), 1000);
    } else {
      alertError(res.message || "Registration failed");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-cyan-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
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
      </Card>    </div>
  );
};

export default Register;

