import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();

  if (!auth) {
    // Se não estiver autenticado, redireciona para o login
    return <Navigate to="/login" />;
  }

  // Se estiver autenticado, renderiza o componente filho
  return children;
};

export default ProtectedRoute;
