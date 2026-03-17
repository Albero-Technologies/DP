import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getStudentPayments, submitPayment } from "../../api/students.api";
import useAuth from "../../context/useAuth";

const STATUS_STYLE = {
  PAID:    { bg: "#dcfce7", text: "#166534" },
  PARTIAL: { bg: "#fef9c3", text: "#92400e" },
  DUE:     { bg: "#fee2e2", text: "#dc2626" },
};
const APPROVAL_STYLE = {
  PENDING:  { bg: "#fef9c3", text: "#92400e" },
  APPROVED: { bg: "#dcfce7", text: "#166534" },
  REJECTED: { bg: "#fee2e2", text: "#dc2626" },
};

function downloadInvoice(invoice, user) {
  const course = invoice.enrollment?.batch?.course?.title || "Course";
  const batch = invoice.enrollment?.batch?.name || "Batch";
  const win = window.open("", "_blank");
  win.document.write(`
    <html><head><title>Invoice #${invoice._id?.slice(-6).toUpperCase()}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
      .header { display: flex; justify-content: space-between; border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px; }
      .logo { font-size: 24px; font-weight: 800; color: #6366f1; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th { background: #6366f1; color: #fff; padding: 10px 14px; text-align: left; }
      td { padding: 10px 14px; border-bottom: 1px solid #e5e7eb; }
      .total-row td { font-weight: 700; font-size: 16px; border-top: 2px solid #6366f1; }
      .status { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700;
        background: ${invoice.status === "PAID" ? "#dcfce7" : invoice.status === "PARTIAL" ? "#fef9c3" : "#fee2e2"};
        color: ${invoice.status === "PAID" ? "#166534" : invoice.status === "PARTIAL" ? "#92400e" : "#dc2626"}; }
      .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; }
    </style></head>
    <body>
      <div class="header">
        <div><div class="logo">EdTech CRM</div><div style="color:#6b7280;font-size:13px;margin-top:4px">Tax Invoice</div></div>
        <div style="text-align:right">
          <div style="font-weight:700">Invoice #${invoice._id?.slice(-6).toUpperCase()}</div>
          <div style="color:#6b7280;font-size:13px">Date: ${new Date(invoice.createdAt).toLocaleDateString("en-IN")}</div>
          <div style="color:#6b7280;font-size:13px">Due: ${invoice.dueDate?.slice(0,10)}</div>
        </div>
      </div>
      <div style="margin-bottom:20px">
        <strong>Bill To:</strong><br/>
        ${user?.name}<br/>
        <span style="color:#6b7280">${user?.email}</span>
      </div>
      <table>
        <tr><th>Description</th><th>Batch</th><th>Amount</th></tr>
        <tr><td>${course}</td><td>${batch}</td><td>₹${invoice.totalAmount?.toLocaleString()}</td></tr>
        <tr class="total-row">
          <td colspan="2">Amount Paid</td><td>₹${invoice.amountPaid?.toLocaleString()}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2">Balance Due</td><td style="color:${invoice.status==="PAID"?"#16a34a":"#dc2626"}">₹${(invoice.totalAmount - invoice.amountPaid)?.toLocaleString()}</td>
        </tr>
      </table>
      <div>Status: <span class="status">${invoice.status}</span></div>
      <div class="footer">EdTech CRM · Thank you for your payment!</div>
      <script>window.print();</script>
    </body></html>
  `);
  win.document.close();
}

function PayModal({ invoice, onClose, onSuccess }) {
  const [mode, setMode] = useState("FULL");
  const [amount, setAmount] = useState("");
  const [txnId, setTxnId] = useState("");
  const [paying, setPaying] = useState(false);
  const remaining = invoice.totalAmount - invoice.amountPaid;

  const handlePay = async () => {
    if (!txnId.trim()) return alert("Enter your UPI Transaction ID");
    const payAmount = mode === "FULL" ? remaining : Number(amount);
    if (!payAmount || payAmount <= 0) return alert("Enter a valid amount");
    if (payAmount > remaining) return alert(`Max payable: ₹${remaining.toLocaleString()}`);
    setPaying(true);
    try {
      await submitPayment({ invoiceId: invoice._id, amount: payAmount, transactionId: txnId, paymentMode: mode });
      alert("✅ Payment submitted! Awaiting counselor approval.");
      onSuccess(); onClose();
    } catch (err) { alert(err.response?.data?.message || "Payment failed"); }
    finally { setPaying(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "min(90vw,420px)" }} onClick={e => e.stopPropagation()}>
        <h2 style={{ margin: "0 0 4px" }}>💳 Pay via UPI</h2>
        <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 20px" }}>Remaining: <strong style={{ color: "#6366f1" }}>₹{remaining?.toLocaleString()}</strong></p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {["FULL", "PARTIAL"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: "10px", borderRadius: 8, border: `2px solid ${mode === m ? "#6366f1" : "#e5e7eb"}`, background: mode === m ? "#eff6ff" : "#fff", color: mode === m ? "#6366f1" : "#374151", fontWeight: 700, cursor: "pointer" }}>
              {m === "FULL" ? `Full ₹${remaining?.toLocaleString()}` : "Partial"}
            </button>
          ))}
        </div>
        {mode === "PARTIAL" && (
          <input type="number" placeholder={`Amount (max ₹${remaining?.toLocaleString()})`} value={amount} onChange={e => setAmount(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }} />
        )}
        <input placeholder="UPI Transaction ID" value={txnId} onChange={e => setTxnId(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, marginBottom: 18, boxSizing: "border-box" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button onClick={handlePay} disabled={paying}
            style={{ padding: 11, background: paying ? "#a5b4fc" : "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
            {paying ? "Submitting..." : "Submit"}
          </button>
          <button onClick={onClose} style={{ padding: 11, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function StudentPaymentsPage() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useFetch(getStudentPayments);
  const [payModal, setPayModal] = useState(null);
  const invoices = data?.invoices || [];
  const payments = data?.payments || [];

  return (
    <div>
      {payModal && <PayModal invoice={payModal} onClose={() => setPayModal(null)} onSuccess={refetch} />}
      <div className="admin-page-header">
        <div><h1>Payments</h1><p>Your invoices, payment history and dues</p></div>
      </div>
      {loading && <p style={{ color: "#6b7280" }}>Loading...</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      {/* Invoice cards */}
      {invoices.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16, marginBottom: 28 }}>
          {invoices.map(inv => {
            const remaining = inv.totalAmount - inv.amountPaid;
            const ss = STATUS_STYLE[inv.status] || STATUS_STYLE.DUE;
            return (
              <div key={inv._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#9ca3af" }}>INV-{inv._id?.slice(-6).toUpperCase()}</div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: "#111827", marginTop: 2 }}>{inv.enrollment?.batch?.course?.title || "Course"}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{inv.enrollment?.batch?.name}</div>
                  </div>
                  <span style={{ padding: "3px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: ss.bg, color: ss.text }}>{inv.status}</span>
                </div>
                {/* Progress bar */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                    <span>Paid: ₹{inv.amountPaid?.toLocaleString()}</span>
                    <span>Total: ₹{inv.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div style={{ background: "#f3f4f6", borderRadius: 99, height: 7 }}>
                    <div style={{ background: "#6366f1", borderRadius: 99, height: 7, width: `${inv.totalAmount > 0 ? (inv.amountPaid/inv.totalAmount)*100 : 0}%` }} />
                  </div>
                </div>
                {remaining > 0 && (
                  <div style={{ fontSize: 13, color: "#dc2626", fontWeight: 600, marginBottom: 12 }}>
                    Due: ₹{remaining.toLocaleString()} · Due date: {inv.dueDate?.slice(0,10)}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  {remaining > 0 && (
                    <button onClick={() => setPayModal(inv)}
                      style={{ flex: 1, padding: "8px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                      💳 Pay Now
                    </button>
                  )}
                  <button onClick={() => downloadInvoice(inv, user)}
                    style={{ flex: 1, padding: "8px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                    ⬇ Invoice
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment history */}
      <section className="admin-section">
        <h2>Transaction History</h2>
        <div className="admin-list">
          {payments.map(p => {
            const ap = APPROVAL_STYLE[p.approvalStatus] || APPROVAL_STYLE.PENDING;
            return (
              <div className="admin-list-item" key={p._id}>
                <div>
                  <strong style={{ fontSize: 16 }}>₹{p.amount?.toLocaleString()}</strong>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>UPI · {p.transactionId} · {new Date(p.paidAt || p.createdAt).toLocaleDateString("en-IN")}</div>
                </div>
                <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: ap.bg, color: ap.text }}>
                  {p.approvalStatus}
                </span>
              </div>
            );
          })}
          {!loading && !payments.length && <p style={{ color: "#6b7280", padding: 16 }}>No transactions yet.</p>}
        </div>
      </section>
    </div>
  );
}