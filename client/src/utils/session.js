export const getSession = () => {
  const username = localStorage.getItem("username") || "";
  const role = localStorage.getItem("role") || "";
  const token = localStorage.getItem("token") || "";
  const userId = localStorage.getItem("userId") || "";
  const profilePic = localStorage.getItem("profilePic") || "";

  return {
    username,
    role,
    token,
    userId,
    profilePic,
    isLoggedIn: Boolean(token && username),
    isAdmin: role === "admin",
    isUser: role === "user",
  };
};

export const saveSession = ({ user, token }) => {
  if (!user || !token) {
    clearSession();
    return;
  }

  localStorage.setItem("username", user.username);
  localStorage.setItem("role", user.role);
  localStorage.setItem("token", token);
  localStorage.setItem("userId", user._id);
  if (user.profilePic) {
    localStorage.setItem("profilePic", user.profilePic);
  } else {
    localStorage.removeItem("profilePic");
  }
};

export const clearSession = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("profilePic");
};
