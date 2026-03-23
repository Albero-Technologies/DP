import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";

import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Users,
  CreditCard,
  PlayCircle,
  UserCog,
  Layers,
  Clock,
  Link,
  Bell,
  Headphones,
  Award
} from "lucide-react";

const navConfig = {
  admin: [
    { path: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
    { path: "courses",      label: "Courses",      icon: BookOpen },
    { path: "batches",      label: "Batches",      icon: CalendarDays },
    { path: "students",     label: "Students",     icon: Users },
    { path: "payments",     label: "Payments",     icon: CreditCard },
    { path: "demo-courses", label: "Demo Courses", icon: PlayCircle },
    { path: "staff",        label: "Staff",        icon: UserCog },
  ],

  trainer: [
    { path: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "cohorts",   label: "Cohorts",   icon: Layers },
    { path: "sessions",  label: "Sessions",  icon: Clock },
  ],

  counselor: [
    { path: "dashboard",       label: "Dashboard",       icon: LayoutDashboard },
    { path: "students",        label: "Students",        icon: Users },
    { path: "enrollment-link", label: "Enrollment Link", icon: Link },
    { path: "batches",         label: "Batch & Sessions",icon: CalendarDays },
    { path: "payments",        label: "Payments",        icon: CreditCard },
    { path: "reminders",       label: "Reminders",       icon: Bell },
    { path: "support",         label: "Support",         icon: Headphones },
  ],

  student: [
    { path: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
    { path: "demo-courses", label: "Demo Courses", icon: PlayCircle },
    { path: "courses",      label: "My Batches",   icon: BookOpen },
    { path: "payments",     label: "Payments",     icon: CreditCard },
    { path: "certificates", label: "Certificates", icon: Award },
    { path: "support",      label: "Support",      icon: Headphones },
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
        {items.map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={`/${r}/${link.path}`}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? " active" : ""}`
              }
            >
              <span style={{ minWidth: 20, display: "flex", alignItems: "center" }}>
                <Icon size={16} />
              </span>
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        className="admin-logout"
        type="button"
        onClick={() => {
          logout();
          navigate("/signin");
        }}
      >
        ← Logout
      </button>
    </aside>
  );
}