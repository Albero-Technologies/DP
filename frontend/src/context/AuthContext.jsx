import { createContext, useState, useEffect } from "react";
import API, { setToken, clearToken } from "../api/axiosInstance";

export const AuthContext = createContext(null);

const TOKEN_KEY = "token";
const USER_KEY  = "user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Silent background token verify on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    API.get("/auth/me")
      .then(res => {
        const u = res.data.user || res.data;
        setUser(u);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        clearToken();
        setUser(null);
      });
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Clear old session
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      clearToken();

      const res = await API.post("/auth/login", { email, password });
      const { token, user: userData } = res.data;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setToken(token);
      setUser(userData);

      return { data: userData };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Check your credentials.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    clearToken();
    setUser(null);
  };

  const isAdmin     = user?.role === "ADMIN";
  const isTrainer   = user?.role === "TRAINER";
  const isCounselor = user?.role === "COUNSELOR";
  const isStudent   = user?.role === "STUDENT";
  const roleRoute   = user?.role ? user.role.toLowerCase() : null;

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      login, logout,
      isAdmin, isTrainer, isCounselor, isStudent, roleRoute,
    }}>
      {children}
    </AuthContext.Provider>
  );
};