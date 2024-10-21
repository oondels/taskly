import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, putUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2399/auth/check-auth",
          {
            withCredentials: true, // Inclui cookies na requisição
          }
        );
        setAuth(response.data.authenticated);
      } catch (error) {
        setAuth(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = () => {
    setAuth(true);
    localStorage.setItem("authenticated", "true");
  };

  return (
    <AuthContext.Provider value={{ auth, login, loading, user, putUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
