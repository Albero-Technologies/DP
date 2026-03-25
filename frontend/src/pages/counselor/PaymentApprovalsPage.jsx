import { useState, useEffect } from "react";
import API from "../../api/axiosInstance";

const STATUS_STYLE = {
  PENDING:  { bg: "#fef9c3", text: "#92400e" },
  APPROVED: { bg: "#dcfce7", text: "#166534" },
  REJECTED: { bg: "#fee2e2", text: "#dc2626" },
};

// Invoice generator (same as admin)
function generateInvoice(payment) {
  const student  = payment.invoice?.enrollment?.student;
  const course   = payment.invoice?.enrollment?.batch?.course;
  const date     = new Date(payment.paidAt || payment.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" });
  const invoiceNo = `INV-${payment._id?.slice(-8).toUpperCase()}`;

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>Invoice ${invoiceNo}</title>
<style>
  body{font-family:Arial,sans-serif;margin:0;padding:40px;color:#1a1a1a}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #6366f1;padding-bottom:20px;margin-bottom:24px}
  .brand{font-size:26px;font-weight:900;color:#6366f1}.brand span{color:#1a1a1a}
  .meta{text-align:right}.meta p{margin:2px 0;font-size:13px;color:#6b7280}.meta strong{color:#1a1a1a}
  .section{margin-bottom:20px}.section h3{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin:0 0 8px}
  .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:14px}.row:last-child{border-bottom:none}
  .label{color:#6b7280}.value{font-weight:600}
  .amount-box{background:#f0f4ff;border:2px solid #6366f1;border-radius:10px;padding:20px 24px;margin:24px 0;display:flex;justify-content:space-between;align-items:center}
  .amount-box .big{font-size:28px;font-weight:900;color:#6366f1}
  .status{display:inline-block;padding:3px 12px;border-radius:99px;font-size:12px;font-weight:700;background:#dcfce7;color:#166534}
  .footer{margin-top:40px;text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:16px}
</style></head><body>
<div class="header">
  <div><div class="brand">Data<span>Preneur</span></div><div style="font-size:13px;color:#6b7280;margin-top:4px">PAYMENT INVOICE</div></div>
  <div class="meta">
    <p>Invoice No: <strong>${invoiceNo}</strong></p>
    <p>Date: <strong>${date}</strong></p>
    <p>Status: <span class="status">${payment.approvalStatus}</span></p>
  </div>
</div>
<div class="section">
  <h3>Student Details</h3>
  <div class="row"><span class="label">Name</span><span class="value">${student?.name || "—"}</span></div>
  <div class="row"><span class="label">Email</span><span class="value">${student?.email || "—"}</span></div>
  ${student?.phone ? `<div class="row"><span class="label">Phone</span><span class="value">${student.phone}</span></div>` : ""}
</div>
<div class="section">
  <h3>Course Details</h3>
  <div class="row"><span class="label">Course</span><span class="value">${course?.title || "—"}</span></div>
  <div class="row"><span class="label">Payment Method</span><span class="value">${payment.paymentMethod || "UPI"}</span></div>
  ${payment.transactionId ? `<div class="row"><span class="label">Transaction ID</span><span class="value">${payment.transactionId}</span></div>` : ""}
</div>
<div class="amount-box">
  <div>
    <div style="font-size:13px;color:#6b7280;margin-bottom:4px">Amount Paid</div>
    <div class="big">₹${payment.amount?.toLocaleString("en-IN")}</div>
  </div>
  <span class="status">${payment.approvalStatus}</span>
</div>
<div class="footer">This is a computer-generated invoice. No signature required.<br/>Powered by DataPreneur</div>
</body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

export default function PaymentApprovalsPage() {
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState("ALL");

  const fetchPayments = () => {
    setLoading(true);
    // Get my students first, then their payments
    API.get("/counselor/students")
      .then(async r => {
        const students = r.data.data || [];
        if (!students.length) { setPayments([]); return; }

        const studentIds = students.map(s => s._id);
        // Get enrollments of my students
        const enrollRes = await API.get("/enrollments", { params: { studentId: studentIds[0] } });
        
        // For each student, get their payment data
        const allPayments = [];
        for (const student of students) {
          try {
            const res = await API.get(`/admin/payments/${student._id}`);
            const { payments: pays = [], invoices = [] } = res.data.data || {};
            pays.forEach(p => {
              // Attach student info if not already populated
              if (p.invoice && typeof p.invoice === "object") {
                if (p.invoice.enrollment && typeof p.invoice.enrollment === "object") {
                  if (!p.invoice.enrollment.student) {
                    p.invoice.enrollment.student = student;
                  }
                }
              }
              allPayments.push(p);
            });
          } catch {}
        }
        setPayments(allPayments);
      })
      .catch(err => setError(err?.response?.data?.message || "Failed to load payments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayments(); }, []);

  const filtered = filter === "ALL"
    ? payments
    : payments.filter(p => p.approvalStatus === filter);

  const totalPaid    = payments.filter(p => p.approvalStatus === "APPROVED").reduce((s, p) => s + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.approvalStatus === "PENDING").reduce((s, p) => s + (p.amount || 0), 0);
  const pendingCount = payments.filter(p => p.approvalStatus === "PENDING").length;

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Payments</h1><p>Your students' payment history</p></div>
        <span className="admin-pill" style={{ background: pendingCount > 0 ? "#fef9c3" : "#f3f4f6", color: pendingCount > 0 ? "#92400e" : "#6b7280" }}>
          {pendingCount} pending
        </span>
      </div>

      {/* Summary cards */}
      <div className="admin-metrics" style={{ marginBottom: 24 }}>
        <div className="admin-card admin-card--indigo">
          <h3>Total Collected</h3>
          <div className="admin-metric-value">₹{totalPaid.toLocaleString("en-IN")}</div>
          <div className="admin-pill" style={{ background: "#dcfce7", color: "#166534" }}>Approved</div>
        </div>
        <div className="admin-card">
          <h3>Pending Amount</h3>
          <div className="admin-metric-value">₹{totalPending.toLocaleString("en-IN")}</div>
          <div className="admin-pill" style={{ background: "#fef9c3", color: "#854d0e" }}>{pendingCount} awaiting</div>
        </div>
        <div className="admin-card admin-card--teal">
          <h3>Total Transactions</h3>
          <div className="admin-metric-value">{payments.length}</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
              background: filter === f ? "#6366f1" : "#f3f4f6", color: filter === f ? "#fff" : "#374151" }}>
            {f}{f === "PENDING" && pendingCount > 0 ? ` (${pendingCount})` : ""}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading payments…</p>}
      {error   && <p style={{ color: "#ef4444" }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(p => {
          const student = p.invoice?.enrollment?.student;
          const course  = p.invoice?.enrollment?.batch?.course;
          const batch   = p.invoice?.enrollment?.batch;
          const sc      = STATUS_STYLE[p.approvalStatus] || STATUS_STYLE.PENDING;

          return (
            <div key={p._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                {/* Left info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>₹{p.amount?.toLocaleString("en-IN")}</div>
                  <div style={{ fontSize: 13, color: "#374151", marginTop: 2 }}>
                    <strong>{student?.name || "Student"}</strong>
                    {student?.email && <span style={{ color: "#6b7280" }}> · {student.email}</span>}
                  </div>
                  {course && (
                    <div style={{ fontSize: 12, color: "#6366f1", marginTop: 3 }}>
                      📚 {course.title}{batch ? ` → ${batch.name}` : ""}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>
                    {p.paymentMethod}{p.transactionId ? ` · ${p.transactionId}` : ""} · {new Date(p.paidAt || p.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>

                {/* Right: status + invoice */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
                  <span style={{ padding: "3px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: sc.bg, color: sc.text }}>
                    {p.approvalStatus}
                  </span>
                  {/* Download Invoice */}
                  <button
                    onClick={() => generateInvoice(p)}
                    style={{ padding: "4px 10px", borderRadius: 6, background: "#f0f4ff", color: "#6366f1", border: "1px solid #c7d2fe", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                    📄 Invoice
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && !filtered.length && (
          <div style={{ textAlign: "center", padding: "48px 20px", color: "#9ca3af" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>
              {filter === "PENDING" ? "✅" : filter === "APPROVED" ? "💚" : filter === "REJECTED" ? "❌" : "💳"}
            </div>
            <p style={{ margin: 0 }}>
              {filter === "PENDING" ? "No pending payments." : `No ${filter.toLowerCase()} payments.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}