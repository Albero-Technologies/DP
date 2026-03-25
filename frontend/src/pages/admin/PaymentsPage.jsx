import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getAllAdminPayments, updatePaymentStatus, editPayment, deletePayment } from "../../api/admin.api";

const STATUS_STYLE = {
  PENDING:  { bg: "#fef9c3", text: "#92400e" },
  APPROVED: { bg: "#dcfce7", text: "#166534" },
  REJECTED: { bg: "#fee2e2", text: "#dc2626" },
};

// ── Invoice PDF generator (browser-based, no library needed) ─
function generateInvoice(payment) {
  const student  = payment.invoice?.enrollment?.student;
  const course   = payment.invoice?.enrollment?.batch?.course;
  const date     = new Date(payment.paidAt || payment.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" });
  const invoiceNo = `INV-${payment._id?.slice(-8).toUpperCase()}`;

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<title>Invoice ${invoiceNo}</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 40px; color: #1a1a1a; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 24px; }
  .brand { font-size: 26px; font-weight: 900; color: #6366f1; }
  .brand span { color: #1a1a1a; }
  .invoice-title { font-size: 13px; color: #6b7280; margin-top: 4px; }
  .meta { text-align: right; }
  .meta p { margin: 2px 0; font-size: 13px; color: #6b7280; }
  .meta strong { color: #1a1a1a; }
  .section { margin-bottom: 20px; }
  .section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin: 0 0 8px; }
  .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
  .row:last-child { border-bottom: none; }
  .label { color: #6b7280; }
  .value { font-weight: 600; }
  .amount-box { background: #f0f4ff; border: 2px solid #6366f1; border-radius: 10px; padding: 20px 24px; margin: 24px 0; display: flex; justify-content: space-between; align-items: center; }
  .amount-box .big { font-size: 28px; font-weight: 900; color: #6366f1; }
  .status { display: inline-block; padding: 3px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; background: #dcfce7; color: #166534; }
  .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; }
</style></head><body>
  <div class="header">
    <div>
      <div class="brand">Data<span>Preneur</span></div>
      <div class="invoice-title">PAYMENT INVOICE</div>
    </div>
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
      <div style="font-size:13px;color:#6b7280;margin-bottom:4px;">Amount Paid</div>
      <div class="big">₹${payment.amount?.toLocaleString("en-IN")}</div>
    </div>
    <span class="status">${payment.approvalStatus}</span>
  </div>

  <div class="footer">
    This is a computer-generated invoice. No signature required.<br/>
    Powered by DataPreneur
  </div>
</body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

// ── Edit Payment Modal ───────────────────────────────────────
function EditModal({ payment, onClose, onSave }) {
  const [form,   setForm]   = useState({ amount: payment.amount, transactionId: payment.transactionId || "", paymentMethod: payment.paymentMethod || "UPI" });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const handleSave = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      await editPayment(payment._id, form);
      onSave();
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    } finally { setSaving(false); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, padding: "24px", width: "min(94vw,440px)", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Edit Payment</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>✕</button>
        </div>
        {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Amount (₹)</label>
            <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              required style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Transaction ID</label>
            <input value={form.transactionId} onChange={e => setForm(p => ({ ...p, transactionId: e.target.value }))}
              placeholder="Optional" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Payment Method</label>
            <select value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))} style={inputStyle}>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: "9px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13 }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              style={{ flex: 1, padding: "9px", border: "none", borderRadius: 8, background: "#6366f1", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, width: "100%", boxSizing: "border-box" };

// ── Main Page ────────────────────────────────────────────────
export default function PaymentsPage() {
  const { data: payments, loading, error, refetch } = useFetch(getAllAdminPayments);
  const [updating,    setUpdating]    = useState(null);
  const [deleting,    setDeleting]    = useState(null);
  const [filter,      setFilter]      = useState("ALL");
  const [editPaymentData, setEditPaymentData] = useState(null);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try { await updatePaymentStatus(id, status); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Update failed"); }
    finally { setUpdating(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment entry? This cannot be undone.")) return;
    setDeleting(id);
    try { await deletePayment(id); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
    finally { setDeleting(null); }
  };

  const filtered = filter === "ALL" ? payments : payments?.filter(p => p.approvalStatus === filter);
  const total    = payments?.reduce((s, p) => s + (p.amount || 0), 0) || 0;
  const approved = payments?.filter(p => p.approvalStatus === "APPROVED").reduce((s, p) => s + p.amount, 0) || 0;
  const pending  = payments?.filter(p => p.approvalStatus === "PENDING").length || 0;

  return (
    <div>
      {/* Edit Modal */}
      {editPaymentData && (
        <EditModal
          payment={editPaymentData}
          onClose={() => setEditPaymentData(null)}
          onSave={() => { setEditPaymentData(null); refetch(); }}
        />
      )}

      <div className="admin-page-header">
        <div><h1>Payment History</h1><p>All student payments and approval status</p></div>
        <span className="admin-pill">{payments?.length ?? 0} transactions</span>
      </div>

      {/* Summary cards */}
      <div className="admin-metrics" style={{ marginBottom: 24 }}>
        <div className="admin-card admin-card--indigo">
          <h3>Total Collected</h3>
          <div className="admin-metric-value">₹{total.toLocaleString("en-IN")}</div>
        </div>
        <div className="admin-card">
          <h3>Approved</h3>
          <div className="admin-metric-value">₹{approved.toLocaleString("en-IN")}</div>
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
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: filter === f ? "#6366f1" : "#fff", color: filter === f ? "#fff" : "#374151", cursor: "pointer", fontSize: 13, fontWeight: filter === f ? 700 : 400 }}>
            {f}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading payments...</p>}
      {error   && <p style={{ color: "#ef4444" }}>{error}</p>}

      <div className="admin-list">
        {filtered?.map(p => {
          const student = p.invoice?.enrollment?.student;
          const course  = p.invoice?.enrollment?.batch?.course;
          const sc      = STATUS_STYLE[p.approvalStatus] || STATUS_STYLE.PENDING;

          return (
            <div key={p._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>

                {/* Left: payment info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>₹{p.amount?.toLocaleString("en-IN")}</div>
                  <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>
                    {student?.name || "Student"} · {student?.email || ""}
                  </div>
                  <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>
                    {p.paymentMethod}{p.transactionId ? ` · ${p.transactionId}` : ""} · {new Date(p.paidAt || p.createdAt).toLocaleDateString("en-IN")}
                  </div>
                  {course && (
                    <div style={{ color: "#6366f1", fontSize: 12, marginTop: 4, fontWeight: 500 }}>📚 {course.title}</div>
                  )}
                </div>

                {/* Right: status + actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
                  <span style={{ padding: "3px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: sc.bg, color: sc.text }}>
                    {p.approvalStatus}
                  </span>

                  {/* Approve / Reject (only for PENDING) */}
                  {p.approvalStatus === "PENDING" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleStatus(p._id, "APPROVED")} disabled={updating === p._id}
                        style={{ padding: "4px 10px", borderRadius: 6, background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        ✓ Approve
                      </button>
                      <button onClick={() => handleStatus(p._id, "REJECTED")} disabled={updating === p._id}
                        style={{ padding: "4px 10px", borderRadius: 6, background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        ✕ Reject
                      </button>
                    </div>
                  )}

                  {/* Action buttons: Invoice + Edit + Delete */}
                  <div style={{ display: "flex", gap: 6 }}>
                    {/* Download Invoice */}
                    <button
                      onClick={() => generateInvoice(p)}
                      title="Download Invoice"
                      style={{ padding: "4px 10px", borderRadius: 6, background: "#f0f4ff", color: "#6366f1", border: "1px solid #c7d2fe", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                      📄 Invoice
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => setEditPaymentData(p)}
                      title="Edit Payment"
                      style={{ padding: "4px 10px", borderRadius: 6, background: "#f8fafc", color: "#374151", border: "1px solid #e5e7eb", cursor: "pointer", fontSize: 12 }}>
                      ✏️ Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={deleting === p._id}
                      title="Delete Entry"
                      style={{ padding: "4px 10px", borderRadius: 6, background: "#fff", color: "#ef4444", border: "1px solid #fecaca", cursor: "pointer", fontSize: 12 }}>
                      {deleting === p._id ? "…" : "🗑 Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!loading && !filtered?.length && (
          <p style={{ color: "#6b7280", padding: 16 }}>No payments found.</p>
        )}
      </div>
    </div>
  );
}