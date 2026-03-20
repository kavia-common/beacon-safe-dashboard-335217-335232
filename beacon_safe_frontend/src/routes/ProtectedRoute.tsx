import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

// PUBLIC_INTERFACE
export function ProtectedRoute() {
  /** Redirects to / if user is not authenticated (login screen removed). */
  const { user } = useAppContext();
  if (!user?.token) return <Navigate to="/" replace />;
  return <Outlet />;
}
