import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getAllCounselorPayments, getPendingPayments, updatePaymentApproval, sendPaymentReminder } from "../../api/counselor.api";
import { getCounselorStudents } from "../../api/counselor.api";

const STATUS_STYLE = {
  PENDING:  { bg: "#fef9c3", text: "#92400e" },
  APPROVED: { bg: "#dcfce7", text: "#166534" },
  REJECTED: { bg: "#fee2e2", text: "#dc2626" },
};

export default function PaymentApprovalsPage() {
  const { data: allPayments, loading, error, refetch } = useFetch(getAllCounselorPayments);
  const { data: students } = useFetch(getCounselorStudents);
  const [filter, setFilter] = useState("PENDING");
  const [updating, setUpdating] = useState(null);
  const [reminderStudent, setReminderStudent] = useState("");
  const [reminderMsg, setReminderMsg] = useState("");
  const [sending, setSending] = useState(false);

  const filtered = filter === "ALL"
    ? (allPayments || [])
    : (allPayments || []).filter(p => p.approvalStatus === filter);

  const pendingCount = allPayments?.filter(p => p.approvalStatus === "PENDING").length || 0;

  const handleApproval = async (id, status) => {
    setUpdating(id);
    try { await updatePaymentApproval(id, status); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Failed"); }
    finally { setUpdating(null); }
  };

  const handleReminder = async (e) => {
    e.preventDefault();
    if (!reminderStudent) return alert("Please select a student");
    setSending(true);
    try {
      await sendPaymentReminder({ studentId: reminderStudent, message: reminderMsg });
      alert("✅ Reminder sent successfully!");
      setReminderStudent(""); setReminderMsg("");
    } catch (err) { alert(err.response?.data?.message || "Failed to send reminder"); }
    finally { setSending(false); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Payments</h1><p>Approve or reject student payment submissions</p></div>
        <span className="admin-pill" style={{ background: pendingCount > 0 ? "#fef9c3" : "#f3f4f6", color: pendingCount > 0 ? "#92400e" : "#6b7280" }}>
          {pendingCount} pending
        </span>
      </div>

      {/* Payment Reminder */}
      <section className="admin-section" style={{ marginBottom: 24 }}>
        <h2>💳 Send Payment Reminder</h2>
        <form onSubmit={handleReminder} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end", marginTop: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 5, fontWeight: 600 }}>Select Student</label>
            <select value={reminderStudent} onChange={e => setReminderStudent(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}>
              <option value="">Choose student...</option>
              {students?.map(s => (
                <option key={s._id} value={s._id}>{s.name} — {s.email}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 5, fontWeight: 600 }}>Message (optional)</label>
            <input value={reminderMsg} onChange={e => setReminderMsg(e.target.value)}
              placeholder="Custom reminder message..."
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
          </div>
          <button type="submit" disabled={sending}
            style={{ padding: "10px 18px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
            {sending ? "Sending..." : "📩 Send Reminder"}
          </button>
        </form>
      </section>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["PENDING", "APPROVED", "REJECTED", "ALL"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
              background: filter === f ? "#6366f1" : "#f3f4f6", color: filter === f ? "#fff" : "#374151" }}>
            {f} {f === "PENDING" && pendingCount > 0 ? `(${pendingCount})` : ""}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading payments...</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(p => {
          const student = p.invoice?.enrollment?.student;
          const course = p.invoice?.enrollment?.batch?.course;
          const batch = p.invoice?.enrollment?.batch;
          const sc = STATUS_STYLE[p.approvalStatus] || STATUS_STYLE.PENDING;
          return (
            <div key={p._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 20, color: "#111827" }}>₹{p.amount?.toLocaleString()}</div>
                  <div style={{ color: "#374151", fontSize: 14, marginTop: 2 }}>
                    <strong>{student?.name || "Student"}</strong> · {student?.email}
                  </div>
                  {course && (
                    <div style={{ color: "#6366f1", fontSize: 13, marginTop: 3 }}>
                      📚 {course.title} {batch ? `→ ${batch.name}` : ""}
                    </div>
                  )}
                  <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 3 }}>
                    {p.paymentMethod} {p.transactionId ? `· TXN: ${p.transactionId}` : ""} · {new Date(p.paidAt || p.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                  <span style={{ padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: sc.bg, color: sc.text }}>
                    {p.approvalStatus}
                  </span>
                  {p.approvalStatus === "PENDING" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleApproval(p._id, "APPROVED")} disabled={updating === p._id}
                        style={{ padding: "6px 16px", borderRadius: 8, background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                        ✓ Approve
                      </button>
                      <button onClick={() => handleApproval(p._id, "REJECTED")} disabled={updating === p._id}
                        style={{ padding: "6px 16px", borderRadius: 8, background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {!loading && !filtered.length && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#6b7280" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>
              {filter === "PENDING" ? "✅" : filter === "APPROVED" ? "💚" : filter === "REJECTED" ? "❌" : "💳"}
            </div>
            <p>{filter === "PENDING" ? "No pending payments. All caught up!" : `No ${filter.toLowerCase()} payments.`}</p>
          </div>
        )}
      </div>
    </div>
  );
}