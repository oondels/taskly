import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

const ProtectedRoute = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    // Mostra um componente de carregamento enquanto verifica a autenticação
    return <div>Loading...</div>;
  }

  if (!auth) {
    return <Navigate to="/login" />;
  }

  // Se estiver autenticado, renderiza o componente filho
  return children;
};

export default ProtectedRoute;
