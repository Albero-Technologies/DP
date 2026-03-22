import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import useAuth from "../../context/useAuth";

const ROLE_ROUTES = {
  ADMIN:     "/admin/dashboard",
  TRAINER:   "/trainer/dashboard",
  COUNSELOR: "/counselor/dashboard",
  STUDENT:   "/student/dashboard",
};

export default function SignInPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form.email, form.password);
      const role = res.data?.role;
      navigate(ROLE_ROUTES[role] || "/");
    } catch {
      // error shown via context
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your DataPreneur workspace">
      <form className="auth-form" onSubmit={handleSubmit}>

        {error && (
          <div style={{
            color: "#ef4444", background: "#fef2f2",
            border: "1px solid #fecaca", borderRadius: 8,
            padding: "10px 14px", fontSize: 14,
          }}>
            {error}
          </div>
        )}

        <div>
          <label className="auth-label" htmlFor="signin-email">Email address</label>
          <div className="auth-input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/>
            </svg>
            <input
              id="signin-email" name="email" type="email"
              placeholder="name@company.com" autoComplete="email"
              value={form.email} onChange={handleChange} required
            />
          </div>
        </div>

        <div>
          <label className="auth-label" htmlFor="signin-password">Password</label>
          <div className="auth-input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input
              id="signin-password" name="password"
              type={showPwd ? "text" : "password"}
              placeholder="••••••••" autoComplete="current-password"
              value={form.password} onChange={handleChange} required
            />
            <button
              type="button"
              onClick={() => setShowPwd(p => !p)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0 4px", color: "#94A3B8", flexShrink: 0 }}
              tabIndex={-1}
            >
              {showPwd ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className="auth-row">
          <label className="auth-checkbox">
            <input type="checkbox" /> Remember me
          </label>
          <Link className="auth-link" to="/forgot-password">Forgot password?</Link>
        </div>

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In →"}
        </button>

        {/* Info box — no signup link */}
        <div style={{
          background: "#f8fafc", borderRadius: 8, padding: "12px 14px",
          fontSize: 12, color: "#6b7280", border: "1px solid #e5e7eb",
        }}>
          <strong>Admin:</strong> Use credentials from your <code>.env</code> file.<br />
          <strong>Counselors / Trainers / Students:</strong> Use credentials provided by your Admin or Counselor.
        </div>

        {/* Signup link REMOVED — students are created by counselors */}

      </form>
    </AuthLayout>
  );
}