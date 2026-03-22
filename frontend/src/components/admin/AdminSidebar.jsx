import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";

const navConfig = {
  admin: [
    { path: "dashboard",    label: "Dashboard",    icon: "▦"  },
    { path: "courses",      label: "Courses",      icon: "📚" },
    { path: "batches",      label: "Batches",      icon: "🗓" },
    { path: "students",     label: "Students",     icon: "👥" },
    { path: "payments",     label: "Payments",     icon: "💳" },
    { path: "demo-courses", label: "Demo Courses", icon: "▶"  },
    { path: "staff",        label: "Staff",        icon: "👤" },
    // Reports REMOVED
  ],
  trainer: [
    { path: "dashboard", label: "Dashboard", icon: "▦"  },
    { path: "cohorts",   label: "Cohorts",   icon: "🗓" },
    { path: "sessions",  label: "Sessions",  icon: "🕐" },
    // Students + Reports REMOVED
  ],
  counselor: [
    { path: "dashboard",       label: "Dashboard",       icon: "▦"  },
    { path: "students",        label: "Students",        icon: "👥" },
    { path: "enrollment-link", label: "Enrollment Link", icon: "🔗" },
    { path: "batches",         label: "Batch & Sessions",icon: "🗓" },
    { path: "payments",        label: "Payments",        icon: "💳" },
    { path: "reminders",       label: "Reminders",       icon: "⏰" },
    { path: "support",         label: "Support",         icon: "🎧" },
    // Follow-ups + Reports REMOVED
  ],
  student: [
    { path: "dashboard",    label: "Dashboard",    icon: "▦"  },
    { path: "demo-courses", label: "Demo Courses", icon: "▶"  },
    { path: "courses",      label: "My Batches",   icon: "📚" },
    { path: "payments",     label: "Payments",     icon: "💳" },
    { path: "certificates", label: "Certificates", icon: "🏆" },
    { path: "support",      label: "Support",      icon: "🎧" },
  ],
};

const roleLabels = {
  admin: "Admin Portal",
  trainer: "Trainer Portal",
  counselor: "Counselor Portal",
  student: "Student Portal",
};

export default function AdminSidebar({ role = "admin" }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const r = role.toLowerCase();
  const items = navConfig[r] || navConfig.admin;

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <div className="admin-logo-mark">E</div>
        <div>
          <strong>EdTech CRM</strong>
          <span>{roleLabels[r]}</span>
        </div>
      </div>

      <nav className="admin-nav">
        {items.map(link => (
          <NavLink
            key={link.path}
            to={`/${r}/${link.path}`}
            className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}
          >
            <span style={{ fontSize: 16, minWidth: 20 }}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        className="admin-logout"
        type="button"
        onClick={() => { logout(); navigate("/signin"); }}
      >
        ← Logout
      </button>
    </aside>
  );
}