import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import useAuth from "../../context/useAuth";

export default function CounselorDashboard() {
  const { user } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    API.get("/reports/counselor-dashboard")
      .then(r => setData(r.data.data))
      .catch(err => setError(err?.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  // My students count from counselor-specific endpoint
  const [myStudents, setMyStudents] = useState(null);
  useEffect(() => {
    API.get("/counselor/students")
      .then(r => setMyStudents(r.data.data?.length ?? 0))
      .catch(() => setMyStudents(0));
  }, []);

  // My reminders
  const [reminders, setReminders] = useState([]);
  useEffect(() => {
    API.get("/counselor/reminders")
      .then(r => setReminders(r.data.data || []))
      .catch(() => {});
  }, []);

  const pendingReminders = reminders.filter(r => r.status === "PENDING").length;
  const paidReminders    = reminders.filter(r => r.status === "PAID").length;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Counselor Dashboard</h1>
          <p>Welcome back, {user?.name} — here's your overview</p>
        </div>
      </div>

      {loading && (
        <div className="admin-metrics">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="admin-card" style={{ opacity: 0.4, minHeight: 90 }}>
              <h3>Loading…</h3>
              <div className="admin-metric-value">—</div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {!loading && (
        <>
          {/* ── Stats cards ── */}
          <div className="admin-metrics" style={{ marginBottom: 28 }}>
            <div className="admin-card admin-card--indigo">
              <h3>My Students</h3>
              <div className="admin-metric-value">{data?.totalMyStudents ?? myStudents ?? "—"}</div>
              <div className="admin-pill">Enrolled via my link</div>
            </div>

            <div className="admin-card">
              <h3>Total Enrollments</h3>
              <div className="admin-metric-value">{data?.totalEnrollments ?? 0}</div>
              <div className="admin-pill" style={{ background: "#ede9fe", color: "#5b21b6" }}>
                {data?.enrollmentsThisMonth ?? 0} this month
              </div>
            </div>

            <div className="admin-card admin-card--teal">
              <h3>Revenue Collected</h3>
              <div className="admin-metric-value">₹{(data?.totalRevenueCollected ?? 0).toLocaleString("en-IN")}</div>
              <div className="admin-pill" style={{ background: "#dcfce7", color: "#166534" }}>Approved payments</div>
            </div>

            <div className="admin-card">
              <h3>Pending Invoices</h3>
              <div className="admin-metric-value">{data?.pendingInvoices ?? 0}</div>
              <div className="admin-pill" style={{ background: "#fef9c3", color: "#854d0e" }}>Needs follow-up</div>
            </div>
          </div>

          {/* ── Reminders summary ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#374151" }}>⏰ Payment Reminders</h3>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#f59e0b" }}>{pendingReminders}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Pending</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#16a34a" }}>{paidReminders}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Paid</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#6366f1" }}>{reminders.length}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Total sent</div>
                </div>
              </div>
            </div>

            <div style={{ background: "#f2f5ff", border: "1.5px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: "18px 20px" }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "#374151" }}>🔗 Your Enrollment Link</h3>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 10px" }}>
                Share this link with prospective students to enroll them under your profile.
              </p>
              <a href="/counselor/enrollment-link"
                style={{ display: "inline-block", padding: "6px 14px", background: "#6366f1", color: "#fff", borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                View Enrollment Link →
              </a>
            </div>
          </div>

          {/* ── Recent reminders list ── */}
          {reminders.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Recent Reminders</h3>
                <a href="/counselor/reminders" style={{ fontSize: 12, color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>View all →</a>
              </div>
              {reminders.slice(0, 5).map(r => (
                <div key={r._id} style={{ padding: "12px 18px", borderBottom: "1px solid #f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#111827" }}>{r.student?.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>₹{r.amount?.toLocaleString("en-IN")} · {r.message?.slice(0, 50)}{r.message?.length > 50 ? "…" : ""}</p>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 100,
                    background: r.status === "PAID" ? "#dcfce7" : "#fef9c3",
                    color: r.status === "PAID" ? "#166534" : "#854d0e",
                  }}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {reminders.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
              <p style={{ margin: 0 }}>No activity yet. Start by sharing your enrollment link!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}