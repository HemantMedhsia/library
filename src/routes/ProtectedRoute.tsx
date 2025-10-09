// src/routes/ProtectedRoute.tsx
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // If you want to support SSR or full safety, you might call /auth/me to verify cookie
  if (isAuthenticated) {
    return children;
  }

  return <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
