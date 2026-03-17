import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getAllAdminPayments, updatePaymentStatus } from "../../api/admin.api";

const STATUS_STYLE = {
  PENDING:  { bg: "#fef9c3", text: "#92400e" },
  APPROVED: { bg: "#dcfce7", text: "#166534" },
  REJECTED: { bg: "#fee2e2", text: "#dc2626" },
};

export default function PaymentsPage() {
  const { data: payments, loading, error, refetch } = useFetch(getAllAdminPayments);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try { await updatePaymentStatus(id, status); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Update failed"); }
    finally { setUpdating(null); }
  };

  const filtered = filter === "ALL" ? payments : payments?.filter(p => p.approvalStatus === filter);
  const total = payments?.reduce((s, p) => s + (p.amount || 0), 0) || 0;
  const approved = payments?.filter(p => p.approvalStatus === "APPROVED").reduce((s, p) => s + p.amount, 0) || 0;
  const pending = payments?.filter(p => p.approvalStatus === "PENDING").length || 0;

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Payment History</h1><p>All student payments and approval status</p></div>
        <span className="admin-pill">{payments?.length ?? 0} transactions</span>
      </div>

      {/* Summary cards */}
      <div className="admin-metrics" style={{ marginBottom: 24 }}>
        <div className="admin-card admin-card--indigo">
          <h3>Total Collected</h3>
          <div className="admin-metric-value">₹{total.toLocaleString()}</div>
        </div>
        <div className="admin-card">
          <h3>Approved</h3>
          <div className="admin-metric-value">₹{approved.toLocaleString()}</div>
          <div className="admin-pill" style={{ background: "#dcfce7", color: "#166534" }}>Verified</div>
        </div>
        <div className="admin-card admin-card--teal">
          <h3>Pending Approval</h3>
          <div className="admin-metric-value">{pending}</div>
          <div className="admin-pill">Needs review</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: filter === f ? "#6366f1" : "#fff", color: filter === f ? "#fff" : "#374151", cursor: "pointer", fontSize: 13 }}>
            {f}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading payments...</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      <div className="admin-list">
        {filtered?.map(p => {
          const student = p.invoice?.enrollment?.student;
          const course = p.invoice?.enrollment?.batch?.course;
          const sc = STATUS_STYLE[p.approvalStatus] || STATUS_STYLE.PENDING;
          return (
            <div key={p._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px 20px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>₹{p.amount?.toLocaleString()}</div>
                  <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>
                    {student?.name || "Student"} · {student?.email}
                  </div>
                  <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>
                    {p.paymentMethod} {p.transactionId ? `· ${p.transactionId}` : ""} · {new Date(p.paidAt || p.createdAt).toLocaleDateString()}
                  </div>
                  {course && <div style={{ color: "#6366f1", fontSize: 12, marginTop: 2 }}>📚 {course.title}</div>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                  <span style={{ padding: "3px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.text }}>
                    {p.approvalStatus}
                  </span>
                  {p.approvalStatus === "PENDING" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleStatus(p._id, "APPROVED")} disabled={updating === p._id}
                        style={{ padding: "4px 10px", borderRadius: 6, background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", cursor: "pointer", fontSize: 12 }}>
                        ✓ Approve
                      </button>
                      <button onClick={() => handleStatus(p._id, "REJECTED")} disabled={updating === p._id}
                        style={{ padding: "4px 10px", borderRadius: 6, background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", cursor: "pointer", fontSize: 12 }}>
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {!loading && !filtered?.length && <p style={{ color: "#6b7280", padding: 16 }}>No payments found.</p>}
      </div>
    </div>
  );
}
