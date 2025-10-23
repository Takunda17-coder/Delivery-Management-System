import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />; // redirect if not logged in
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />; // redirect if role mismatch

  return children; // render the page
}
