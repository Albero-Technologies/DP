import { useState, useEffect } from "react";
import useAuth from "../../context/useAuth";
import API from "../../api/axiosInstance";
import CashfreeCheckout from "../../components/CashfreeCheckout";

const INV_STATUS = {
  PAID:    { bg:"#dcfce7", text:"#166534", label:"PAID" },
  PARTIAL: { bg:"#fef9c3", text:"#92400e", label:"PARTIAL" },
  DUE:     { bg:"#fee2e2", text:"#dc2626", label:"DUE" },
  UNPAID:  { bg:"#fee2e2", text:"#dc2626", label:"UNPAID" },
};
const PAY_STATUS = {
  PENDING:  { bg:"#fef9c3", text:"#92400e" },
  APPROVED: { bg:"#dcfce7", text:"#166534" },
  REJECTED: { bg:"#fee2e2", text:"#dc2626" },
};

function generateInvoicePDF(invoice, user) {
  const course = invoice.enrollment?.batch?.course?.title || "Course";
  const batch  = invoice.enrollment?.batch?.name || "Batch";
  const win = window.open("", "_blank");
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Invoice</title>
  <style>
    body{font-family:Arial,sans-serif;padding:40px;color:#1a1a1a}
    .header{display:flex;justify-content:space-between;border-bottom:3px solid #6366f1;padding-bottom:16px;margin-bottom:24px}
    .logo{font-size:24px;font-weight:900;color:#6366f1}.logo span{color:#1a1a1a}
    table{width:100%;border-collapse:collapse;margin:20px 0}
    th{background:#6366f1;color:#fff;padding:10px 14px;text-align:left}
    td{padding:10px 14px;border-bottom:1px solid #e5e7eb}
    .total td{font-weight:800;font-size:16px;border-top:2px solid #6366f1}
    .status{padding:3px 12px;border-radius:99px;font-size:12px;font-weight:700;
      background:${invoice.status==="PAID"?"#dcfce7":"#fef9c3"};
      color:${invoice.status==="PAID"?"#166534":"#92400e"}}
    .footer{margin-top:40px;text-align:center;color:#9ca3af;font-size:12px;border-top:1px solid #e5e7eb;padding-top:16px}
  </style></head><body>
  <div class="header">
    <div><div class="logo">EdTech<span>CRM</span></div><div style="color:#6b7280;font-size:13px;margin-top:4px">Tax Invoice</div></div>
    <div style="text-align:right">
      <div style="font-weight:700">INV-${invoice._id?.slice(-6).toUpperCase()}</div>
      <div style="color:#6b7280;font-size:13px">Date: ${new Date(invoice.createdAt).toLocaleDateString("en-IN")}</div>
      <div style="color:#6b7280;font-size:13px">Due: ${invoice.dueDate?.slice(0,10)||"—"}</div>
    </div>
  </div>
  <div style="margin-bottom:20px"><strong>Bill To:</strong><br/>${user?.name||""}<br/><span style="color:#6b7280">${user?.email||""}</span></div>
  <table>
    <tr><th>Description</th><th>Batch</th><th>Amount</th></tr>
    <tr><td>${course}</td><td>${batch}</td><td>₹${invoice.totalAmount?.toLocaleString("en-IN")}</td></tr>
    <tr class="total"><td colspan="2">Amount Paid</td><td style="color:#16a34a">₹${invoice.amountPaid?.toLocaleString("en-IN")}</td></tr>
    <tr class="total"><td colspan="2">Balance Due</td><td style="color:${invoice.status==="PAID"?"#16a34a":"#dc2626"}">₹${(invoice.totalAmount-invoice.amountPaid)?.toLocaleString("en-IN")}</td></tr>
  </table>
  <div>Status: <span class="status">${invoice.status}</span></div>
  <div class="footer">EdTech CRM · Thank you for your payment!<br/>This is a computer-generated invoice.</div>
  <script>setTimeout(()=>window.print(),400)</script>
  </body></html>`);
  win.document.close();
}

export default function StudentPaymentsPage() {
  const { user } = useAuth();
  const [invoices,  setInvoices]  = useState([]);
  const [payments,  setPayments]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [payModal,  setPayModal]  = useState(null); // invoice object

  const fetchData = async () => {
    setLoading(true);
    try {
      // First auto-create any missing invoices
      await API.post("/student/auto-invoice").catch(() => {});
      // Then fetch payments data
      const r = await API.get("/student/payments");
      setInvoices(r.data.data?.invoices || []);
      setPayments(r.data.data?.payments || []);
    } catch(err) {
      setError(err?.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Check if redirected back from Cashfree
    const params  = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");
    const status  = params.get("status");
    if (orderId && status === "SUCCESS") {
      window.history.replaceState({}, "", window.location.pathname);
      API.post("/payments/cashfree/verify", { orderId })
        .then(() => fetchData())
        .catch(() => {});
    }
  }, []);

  const totalDue  = invoices.reduce((s, i) => s + Math.max(0, i.totalAmount - i.amountPaid), 0);
  const totalPaid = invoices.reduce((s, i) => s + (i.amountPaid || 0), 0);

  return (
    <div>
      {payModal && (
        <CashfreeCheckout
          invoice={payModal}
          onClose={() => setPayModal(null)}
          onSuccess={() => { setPayModal(null); fetchData(); }}
        />
      )}

      <div className="admin-page-header">
        <div><h1>Payments</h1><p>Your invoices, payment history and dues</p></div>
      </div>

      {/* Summary cards */}
      {!loading && invoices.length > 0 && (
        <div className="admin-metrics" style={{ marginBottom:24 }}>
          <div className="admin-card admin-card--indigo">
            <h3>Total Paid</h3>
            <div className="admin-metric-value">₹{totalPaid.toLocaleString("en-IN")}</div>
            <div className="admin-pill" style={{ background:"#dcfce7",color:"#166534" }}>Verified</div>
          </div>
          <div className="admin-card">
            <h3>Balance Due</h3>
            <div className="admin-metric-value" style={{ color: totalDue > 0 ? "#ef4444" : "#16a34a" }}>
              ₹{totalDue.toLocaleString("en-IN")}
            </div>
            <div className="admin-pill" style={{ background: totalDue > 0 ? "#fee2e2" : "#dcfce7", color: totalDue > 0 ? "#dc2626" : "#166534" }}>
              {totalDue > 0 ? "Pending" : "All Cleared ✅"}
            </div>
          </div>
          <div className="admin-card admin-card--teal">
            <h3>Total Transactions</h3>
            <div className="admin-metric-value">{payments.length}</div>
          </div>
        </div>
      )}

      {loading && <p style={{ color:"#6b7280" }}>Loading payments…</p>}
      {error   && <p style={{ color:"#ef4444" }}>{error}</p>}

      {/* Invoice Cards */}
      {invoices.length > 0 && (
        <div style={{ marginBottom:28 }}>
          <h3 style={{ fontSize:14,fontWeight:700,color:"#374151",margin:"0 0 14px" }}>📋 Invoices ({invoices.length})</h3>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16 }}>
            {invoices.map(inv => {
              const remaining = inv.totalAmount - inv.amountPaid;
              const pct       = inv.totalAmount > 0 ? Math.round((inv.amountPaid / inv.totalAmount) * 100) : 0;
              const ss        = INV_STATUS[inv.status] || INV_STATUS.DUE;
              return (
                <div key={inv._id}
                  style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:20,boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                    <div>
                      <div style={{ fontWeight:700,fontSize:11,color:"#9ca3af",letterSpacing:0.5 }}>
                        INV-{inv._id?.slice(-6).toUpperCase()}
                      </div>
                      <div style={{ fontWeight:700,fontSize:16,color:"#111827",marginTop:2 }}>
                        {inv.enrollment?.batch?.course?.title || "Course"}
                      </div>
                      <div style={{ fontSize:12,color:"#6b7280" }}>{inv.enrollment?.batch?.name}</div>
                    </div>
                    <span style={{ padding:"3px 12px",borderRadius:99,fontSize:11,fontWeight:700,background:ss.bg,color:ss.text }}>
                      {ss.label}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom:12 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,color:"#6b7280",marginBottom:4 }}>
                      <span>Paid: ₹{inv.amountPaid?.toLocaleString("en-IN")}</span>
                      <span>Total: ₹{inv.totalAmount?.toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ background:"#f3f4f6",borderRadius:99,height:7 }}>
                      <div style={{ background: pct===100 ? "#16a34a" : "#6366f1",borderRadius:99,height:7,width:`${pct}%`,transition:"width 0.3s" }} />
                    </div>
                    <div style={{ fontSize:11,color:"#9ca3af",marginTop:3,textAlign:"right" }}>{pct}% paid</div>
                  </div>

                  {remaining > 0 && (
                    <div style={{ background:"#fef2f2",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:13,color:"#dc2626",fontWeight:600 }}>
                      Balance Due: ₹{remaining.toLocaleString("en-IN")}
                      {inv.dueDate && <span style={{ fontWeight:400,color:"#6b7280",marginLeft:8 }}>· Due: {inv.dueDate?.slice(0,10)}</span>}
                    </div>
                  )}

                  <div style={{ display:"flex",gap:8 }}>
                    {remaining > 0 && (
                      <button onClick={() => setPayModal(inv)}
                        style={{ flex:1,padding:"9px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13 }}>
                        💳 Pay Now
                      </button>
                    )}
                    <button onClick={() => generateInvoicePDF(inv, user)}
                      style={{ flex:1,padding:"9px",background:"#f8fafc",color:"#374151",border:"1px solid #e5e7eb",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:13 }}>
                      📄 Invoice
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <section className="admin-section">
        <h2>Transaction History</h2>
        {payments.length === 0 && !loading ? (
          <p style={{ color:"#9ca3af",padding:"16px 0" }}>No transactions yet.</p>
        ) : (
          <div className="admin-list">
            {payments.map(p => {
              const ap = PAY_STATUS[p.approvalStatus] || PAY_STATUS.PENDING;
              return (
                <div key={p._id} style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 18px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div>
                    <strong style={{ fontSize:16 }}>₹{p.amount?.toLocaleString("en-IN")}</strong>
                    <div style={{ color:"#6b7280",fontSize:12,marginTop:2 }}>
                      {p.paymentMethod}{p.transactionId ? ` · ${p.transactionId}` : ""}
                    </div>
                    <div style={{ color:"#9ca3af",fontSize:11,marginTop:1 }}>
                      {new Date(p.paidAt || p.createdAt).toLocaleDateString("en-IN", { dateStyle:"medium" })}
                    </div>
                  </div>
                  <span style={{ padding:"4px 12px",borderRadius:99,fontSize:11,fontWeight:700,background:ap.bg,color:ap.text }}>
                    {p.approvalStatus}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* No invoices empty state */}
      {!loading && invoices.length === 0 && (
        <div style={{ textAlign:"center",padding:"48px 20px",color:"#9ca3af" }}>
          <div style={{ fontSize:48,marginBottom:12 }}>💳</div>
          <p style={{ margin:0,fontWeight:600 }}>No invoices yet</p>
          <p style={{ fontSize:13,marginTop:6 }}>Your counselor will create an invoice once you are enrolled.</p>
        </div>
      )}
    </div>
  );
}