import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import type { UserRole } from "../types/auth";

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p>Učitavanje...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}