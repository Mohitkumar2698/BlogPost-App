import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "@/utils/session";

export const RequireAuth = ({ children }) => {
  const session = getSession();
  const location = useLocation();

  if (!session.isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export const RequireAdmin = ({ children }) => {
  const session = getSession();
  const location = useLocation();

  if (!session.isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!session.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const RequireUser = ({ children }) => {
  const session = getSession();
  const location = useLocation();

  if (!session.isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!session.isUser) {
    return <Navigate to={session.isAdmin ? `/admin/${session.userId || ""}` : "/"} replace />;
  }

  return children;
};
