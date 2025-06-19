"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { registerUser, loginUser } from "@/utils/api";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [identifier, setIdentifier] = useState(null);

  useEffect(() => {
    // Vérifie si un token est stocké dans les cookies
    const token = Cookies.get("accessToken");
    const storedIdentifier = Cookies.get("identifier");
    if (token) {
      setAccessToken(token);
      setIdentifier(storedIdentifier || null);
    }
  }, []);

  // — Inscription
  const signup = async (email, username, password) => {
    try {
      const data = await registerUser(email, username, password);
      // Le backend renvoie `accessToken`
      const token = data.accessToken;
      if (!token) throw new Error("Aucun token reçu à l'inscription");
      setAccessToken(token);
      setIdentifier(username);
    } catch (err) {
      console.error("Signup error:", err);
      throw new Error(err.response?.data?.error || err.message);
    }
  };

  // — Connexion
  const login = async (identifier, password, rememberMe = false) => {
    try {
      const data = await loginUser(identifier, password);
      const token = data.accessToken;
      if (!token) throw new Error("Aucun token reçu à la connexion");
      setAccessToken(token);
      setIdentifier(identifier);
      if (rememberMe) {
        // Stocke le token et l'identifiant dans un cookie sécurisé
        Cookies.set("accessToken", token, {
          secure: true,
          sameSite: "strict",
          expires: 7,
        });
        Cookies.set("identifier", identifier, {
          secure: true,
          sameSite: "strict",
          expires: 7,
        });
      } else {
        Cookies.remove("accessToken");
        Cookies.remove("identifier");
      }
    } catch (err) {
      console.error("Login error:", err);
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setIdentifier(null);
    Cookies.remove("accessToken");
    Cookies.remove("identifier");
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, identifier, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
