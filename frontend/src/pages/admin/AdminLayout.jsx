import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import useAuth from "../../context/useAuth";
import "./AdminLayout.css";

export default function AdminLayout({ role = "admin" }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/signin", { replace: true });
      return;
    }
    // If user role doesn't match this layout's role, redirect to correct dashboard
    const userRoleRoute = user.role.toLowerCase();
    if (userRoleRoute !== role) {
      navigate(`/${userRoleRoute}/dashboard`, { replace: true });
    }
  }, [user, role, navigate]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
    return () => {
      document.body.classList.remove("sidebar-open");
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-shell">
      {/* Hamburger Menu Button */}
      <button
        className={`admin-hamburger ${sidebarOpen ? "open" : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar Overlay */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />
      
      <AdminSidebar role={role} isMobileOpen={sidebarOpen} />
      
      <div className="admin-main">
        <AdminNavbar role={role} onMenuClick={toggleSidebar} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}