import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();
  if (!isInitialized) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
