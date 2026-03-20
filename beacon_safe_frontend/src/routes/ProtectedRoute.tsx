import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

// PUBLIC_INTERFACE
export function ProtectedRoute() {
  /** Redirects to /login if user is not authenticated. */
  const { user } = useAppContext();
  if (!user?.token) return <Navigate to="/login" replace />;
  return <Outlet />;
}
