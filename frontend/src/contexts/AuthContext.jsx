import React, { createContext, useState, useEffect } from "react";
import { setAuthToken } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access") || null);

  useEffect(() => {
    setAuthToken(token);
    if (token) localStorage.setItem("access", token);
    else localStorage.removeItem("access");
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
