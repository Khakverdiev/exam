import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Contexts/AuthContext";

const AdminRoute = ({ children }) => {
  const { role } = useAuth();

  if (role !== "AppAdmin") {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default AdminRoute;
