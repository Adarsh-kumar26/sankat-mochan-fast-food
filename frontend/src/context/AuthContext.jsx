import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("tff_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  function saveSession(token, user) {
    localStorage.setItem("tff_token", token);
    localStorage.setItem("tff_user", JSON.stringify(user));
    setUser(user);
  }

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    saveSession(data.token, data.user);
    return data.user;
  }

  async function register(name, email, phone, password) {
    const { data } = await api.post("/auth/register", { name, email, phone, password });
    saveSession(data.token, data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("tff_token");
    localStorage.removeItem("tff_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
