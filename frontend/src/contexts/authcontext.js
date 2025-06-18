"use client";
import { createContext, useContext, useState } from "react";
import { registerUser, loginUser } from "@/utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  // — Inscription
  const signup = async (email, username, password) => {
    try {
      const data = await registerUser(email, username, password);
      // Le backend renvoie `accessToken`
      const token = data.accessToken;
      if (!token) throw new Error("Aucun token reçu à l'inscription");
      setAccessToken(token);
    } catch (err) {
      console.error("Signup error:", err);
      throw new Error(err.response?.data?.error || err.message);
    }
  };

  // — Connexion
  const login = async (username, password) => {
    try {
      const data = await loginUser(username, password);
      const token = data.accessToken;
      if (!token) throw new Error("Aucun token reçu à la connexion");
      setAccessToken(token);
    } catch (err) {
      console.error("Login error:", err);
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const logout = () => {
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
