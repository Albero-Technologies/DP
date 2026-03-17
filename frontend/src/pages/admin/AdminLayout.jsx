import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import useAuth from "../../context/useAuth";
import "./AdminLayout.css";

export default function AdminLayout({ role = "admin" }) {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  return (
    <div className="admin-shell">
      <AdminSidebar role={role} />
      <div className="admin-main">
        <AdminNavbar role={role} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
