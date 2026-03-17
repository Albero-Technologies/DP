import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
// import useAuth from "../../context/useAuth";
// NEW - replace with this
import useAuth from "../../context/useAuth";

export default function SignUpPage() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register({ ...form, role: "STUDENT" });
      setSuccess("Account created! Redirecting to sign in...");
      setTimeout(() => navigate("/signin"), 1500);
    } catch { /* error shown via context */ }
  };

  return (
    <AuthLayout title="Create Student Account" subtitle="Sign up to access your learning dashboard">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#1d4ed8", marginBottom: 4 }}>
          ℹ️ Student accounts only. Admin, Trainer & Counselor accounts are created by Admin.
        </div>

        {error && <div style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 14 }}>{error}</div>}
        {success && <div style={{ color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: 14 }}>{success}</div>}

        <div>
          <label className="auth-label">Full Name</label>
          <div className="auth-input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
            <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} required autoComplete="name" />
          </div>
        </div>

        <div>
          <label className="auth-label">Email</label>
          <div className="auth-input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="m22 8-10 6L2 8"/></svg>
            <input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} required autoComplete="email" />
          </div>
        </div>

        <div>
          <label className="auth-label">Phone (optional)</label>
          <div className="auth-input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.08 5.18 2 2 0 0 1 6 3h3a2 2 0 0 1 2 1.72 13 13 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L10.09 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 13 13 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <input name="phone" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} autoComplete="tel" />
          </div>
        </div>

        <div>
          <label className="auth-label">Password</label>
          <div className="auth-input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input name="password" type="password" placeholder="Create a strong password" value={form.password} onChange={handleChange} required autoComplete="new-password" />
          </div>
        </div>

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Student Account →"}
        </button>

        <p className="auth-footer">Already have an account? <Link className="auth-link" to="/signin">Sign in</Link></p>
        <p className="auth-muted">By continuing you agree to our Terms and Privacy Policy.</p>
      </form>
    </AuthLayout>
  );
}
