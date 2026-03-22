import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import API from "../api/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function useNotifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);

  const fetchNotifications = useCallback(() => {
    API.get("/notifications")
      .then(r => {
        const data = r.data.data || [];
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    // Use polling + websocket — prevents WebSocket closed error on slow connections
    const socket = io(BACKEND, {
      withCredentials: true,
      transports: ["polling", "websocket"],
      reconnectionAttempts: 3,
    });
    socket.on("connect", () => {
      socket.emit("authenticate", {
        userId: user.id || user._id,
        role: user.role,
      });
    });
    socket.on("connect_error", () => {
      // Silently fail — notifications still work via REST API polling
    });

    socket.on("notification:new", (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(c => c + 1);
    });

    return () => socket.disconnect();
  }, [user, fetchNotifications]);

  const markAllRead = async () => {
    try {
      await API.patch("/notifications/mark-all-read");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const markOneRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(c => Math.max(0, c - 1));
    } catch {}
  };

  return { notifications, unreadCount, markAllRead, markOneRead, refetch: fetchNotifications };
}