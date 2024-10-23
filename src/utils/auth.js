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
            withCredentials: true,
          }
        );
        setAuth(response.data.authenticated);
        putUser(response.data.user);

        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (error) {
        setAuth(false);
        putUser(null);
        localStorage.removeItem("user");
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
