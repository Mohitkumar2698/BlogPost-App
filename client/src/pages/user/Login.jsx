import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserState";
import { useNavigate } from "react-router-dom";
import { alertError, alertSuccess } from "../../utils/alerts";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { saveSession } from "../../utils/session";

const Login = () => {
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
    const res = await loginUser(formData);
    if (res.success) {
      alertSuccess("Login successful!");
      saveSession({ user: res.user, token: res.token });

      if (res.user.role === "admin")
        setTimeout(() => navigate(`/admin/${res.user._id}`), 1000);
      else setTimeout(() => navigate(`/`), 1000);
    } else {
      alertError(res.message || "Login failed!");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-cyan-50 via-white to-emerald-50 flex justify-center items-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-1 text-sm text-slate-700">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm text-slate-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>    </div>
  );
};

export default Login;

