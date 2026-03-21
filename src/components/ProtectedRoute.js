import { Navigate } from "react-router-dom";

const TOKEN_KEYS = ["token", "jwt", "jwtToken", "accessToken"];
const ROLE_KEYS = ["role", "userRole"];

const getToken = () => {
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return null;
};

const getRole = () => {
  for (const key of ROLE_KEYS) {
    const value = localStorage.getItem(key);
    if (value) return value.toLowerCase();
  }
  return null;
};

const ProtectedRoute = ({ requiredRole, children }) => {
  const token = getToken();
  const role = getRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/billing" replace />;
  }

  return children;
};

export default ProtectedRoute;
