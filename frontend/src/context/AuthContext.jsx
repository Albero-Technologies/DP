import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, logoutUser, getMe } from "../api/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Instantly load user from localStorage — no API call needed on every load
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Only verify token if it exists AND we don't already have fresh user data
  // Use a flag so this only runs once per session, not on every navigation
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    // If no token, nothing to verify
    if (!token) return;

    // If we already have user data in localStorage, trust it immediately
    // Only do a background refresh to keep it fresh — don't block the UI
    if (savedUser) {
      // Silent background refresh (non-blocking)
      getMe()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          // Token expired — clear and redirect
          logoutUser();
          setUser(null);
        });
      return;
    }

    // No saved user but token exists — fetch user (first load after login)
    getMe()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        logoutUser();
        setUser(null);
      });
  }, []); // Only on mount

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email, password });
      setUser(res.data);
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Check your credentials.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(userData);
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const isAdmin     = user?.role === "ADMIN";
  const isTrainer   = user?.role === "TRAINER";
  const isCounselor = user?.role === "COUNSELOR";
  const isStudent   = user?.role === "STUDENT";
  const roleRoute   = user?.role ? user.role.toLowerCase() : null;

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, isAdmin, isTrainer, isCounselor, isStudent, roleRoute }}
    >
      {children}
    </AuthContext.Provider>
  );
};