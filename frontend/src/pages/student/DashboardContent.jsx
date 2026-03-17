import { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import { getStudentDashboard } from "../../api/reports.api";
import { getAvailableBatches, selfEnroll } from "../../api/students.api";
import DemoCoursesSection from "./DemoCoursesSection";

function getYouTubeId(url) {
  if (!url) return null;
  const s = url.match(/youtu\.be\/([^?&\n#]+)/);
  if (s) return s[1];
  const w = url.match(/[?&]v=([^?&\n#]+)/);
  return w ? w[1] : null;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [payModal, setPayModal] = useState(null); // { invoice, batch }

  useEffect(() => {
    Promise.all([getStudentDashboard(), getAvailableBatches()])
      .then(([s, b]) => { setStats(s.data); setBatches(b.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (batch) => {
    setEnrolling(batch._id);
    try {
      const res = await selfEnroll(batch._id);
      alert(`✅ Enrolled in "${batch.name}"! Invoice created for ₹${batch.course?.fees?.toLocaleString()}`);
      // Refresh
      const [s, b] = await Promise.all([getStudentDashboard(), getAvailableBatches()]);
      setStats(s.data); setBatches(b.data || []);
      // Open payment modal
      if (res.data?.invoice) setPayModal({ invoice: res.data.invoice, batch });
    } catch (err) { alert(err.response?.data?.message || "Enrollment failed"); }
    finally { setEnrolling(null); }
  };

  const unenrolledBatches = batches.filter(b => !b.isEnrolled);
  const enrolledBatches = batches.filter(b => b.isEnrolled);

  return (
    <div>
      {/* Pay modal triggered after enroll */}
      {payModal && (
        <PayNowModal invoice={payModal.invoice} batch={payModal.batch} onClose={() => setPayModal(null)} />
      )}

      {/* Welcome */}
      <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 16, padding: "22px 28px", color: "#fff", marginBottom: 24 }}>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Welcome back,</div>
        <h1 style={{ margin: "4px 0 4px", fontSize: 22, fontWeight: 800 }}>{user?.name} 🎓</h1>
        <div style={{ opacity: 0.8, fontSize: 13 }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
      </div>

      {loading && <div className="admin-metrics">{[1,2,3].map(i => <div key={i} className="admin-card" style={{ opacity: 0.4 }}><h3>Loading...</h3><div className="admin-metric-value">—</div></div>)}</div>}

      {stats && (
        <>
          {stats.message ? (
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "16px 20px", marginBottom: 24, color: "#92400e" }}>
              <strong>Not enrolled yet!</strong> Browse available batches below and enroll to get started.
            </div>
          ) : (
            <div className="admin-metrics" style={{ marginBottom: 24 }}>
              <div className="admin-card admin-card--indigo">
                <h3>My Course</h3>
                <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>{stats.enrollment?.batch?.course?.title ?? "—"}</div>
                <div className="admin-pill" style={{ marginTop: 8 }}>{stats.enrollment?.status}</div>
              </div>
              <div className="admin-card">
                <h3>Amount Paid</h3>
                <div className="admin-metric-value">₹{(stats.totalPaid ?? 0).toLocaleString()}</div>
                <div className="admin-pill">of ₹{(stats.totalAmount ?? 0).toLocaleString()}</div>
              </div>
              <div className="admin-card admin-card--teal">
                <h3>Balance Due</h3>
                <div className="admin-metric-value" style={{ color: stats.remainingBalance > 0 ? "#ef4444" : "#16a34a" }}>
                  ₹{(stats.remainingBalance ?? 0).toLocaleString()}
                </div>
                <div className="admin-pill">{stats.invoiceStatus}</div>
              </div>
            </div>
          )}
        </>
      )}

      {/* My enrolled batches */}
      {enrolledBatches.length > 0 && (
        <section className="admin-section" style={{ marginBottom: 24 }}>
          <h2>✅ My Enrolled Batches</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14, marginTop: 12 }}>
            {enrolledBatches.map(b => <BatchCard key={b._id} batch={b} enrolled />)}
          </div>
        </section>
      )}

      {/* Free Demo Courses */}
      <DemoCoursesSection />

      {/* Available batches */}
      {unenrolledBatches.length > 0 && (
        <section className="admin-section">
          <h2>🎓 Available Batches — Enroll Now</h2>
          <p style={{ color: "#6b7280", fontSize: 13, margin: "4px 0 16px" }}>
            Browse all active paid programs and enroll directly
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
            {unenrolledBatches.map(b => (
              <BatchCard key={b._id} batch={b} onEnroll={() => handleEnroll(b)} enrolling={enrolling === b._id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function BatchCard({ batch, enrolled, onEnroll, enrolling }) {
  const vid = getYouTubeId(batch.course?.youtubeLink);
  const pct = batch.capacity > 0 ? Math.round((batch.enrolledCount / batch.capacity) * 100) : 0;

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: `2px solid ${enrolled ? "#6366f1" : "#e5e7eb"}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ position: "relative", aspectRatio: "16/9", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", overflow: "hidden" }}>
        {vid
          ? <img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt={batch.course?.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 36 }}>📚</div>
        }
        {enrolled && (
          <div style={{ position: "absolute", top: 8, right: 8, background: "#6366f1", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>✓ ENROLLED</div>
        )}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>{batch.name}</h3>
        <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 6 }}>{batch.course?.title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
          <span style={{ fontWeight: 700, color: "#6366f1", fontSize: 16 }}>₹{batch.course?.fees?.toLocaleString()}</span>
          <span style={{ color: "#6b7280" }}>⏱ {batch.course?.durationInMonths}m</span>
        </div>
        {/* Capacity bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>
            <span>{batch.enrolledCount}/{batch.capacity} seats</span>
            <span>{pct}% full</span>
          </div>
          <div style={{ background: "#f3f4f6", borderRadius: 99, height: 5 }}>
            <div style={{ background: pct > 80 ? "#ef4444" : "#6366f1", borderRadius: 99, height: 5, width: `${pct}%` }} />
          </div>
        </div>
        {batch.trainer && <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>👤 {batch.trainer.name}</div>}
        {!enrolled && (
          <button onClick={onEnroll} disabled={enrolling}
            style={{ width: "100%", padding: "9px", background: enrolling ? "#a5b4fc" : "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: enrolling ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14 }}>
            {enrolling ? "Enrolling..." : "Enroll & Pay →"}
          </button>
        )}
      </div>
    </div>
  );
}

function PayNowModal({ invoice, batch, onClose }) {
  const [mode, setMode] = useState("FULL");
  const [amount, setAmount] = useState("");
  const [txnId, setTxnId] = useState("");
  const [paying, setPaying] = useState(false);
  const remaining = invoice.totalAmount - invoice.amountPaid;

  const handlePay = async () => {
    if (!txnId.trim()) return alert("Enter your UPI Transaction ID");
    const payAmount = mode === "FULL" ? remaining : Number(amount);
    if (!payAmount || payAmount <= 0) return alert("Enter a valid amount");
    if (payAmount > remaining) return alert(`Amount cannot exceed ₹${remaining.toLocaleString()}`);
    setPaying(true);
    try {
      const { submitPayment } = await import("../../api/students.api");
      await submitPayment({ invoiceId: invoice._id, amount: payAmount, transactionId: txnId, paymentMode: mode });
      alert("✅ Payment submitted! Awaiting counselor approval.");
      onClose();
    } catch (err) { alert(err.response?.data?.message || "Payment failed"); }
    finally { setPaying(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "min(90vw,440px)", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <h2 style={{ margin: "0 0 4px" }}>💳 Pay via UPI</h2>
        <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 20px" }}>{batch?.name} · Total: ₹{invoice.totalAmount?.toLocaleString()}</p>

        <div style={{ background: "#eff6ff", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span>Amount Due</span><strong style={{ color: "#6366f1" }}>₹{remaining?.toLocaleString()}</strong>
          </div>
        </div>

        {/* Payment mode */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {["FULL", "PARTIAL"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: "10px", borderRadius: 8, border: `2px solid ${mode === m ? "#6366f1" : "#e5e7eb"}`, background: mode === m ? "#eff6ff" : "#fff", color: mode === m ? "#6366f1" : "#374151", fontWeight: 700, cursor: "pointer" }}>
              {m === "FULL" ? `💯 Full ₹${remaining?.toLocaleString()}` : "✂️ Partial"}
            </button>
          ))}
        </div>

        {mode === "PARTIAL" && (
          <input type="number" placeholder={`Enter amount (max ₹${remaining?.toLocaleString()})`} value={amount} onChange={e => setAmount(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, marginBottom: 14, boxSizing: "border-box" }} />
        )}

        <input placeholder="UPI Transaction ID (e.g. 123456789012)" value={txnId} onChange={e => setTxnId(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, marginBottom: 20, boxSizing: "border-box" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button onClick={handlePay} disabled={paying}
            style={{ padding: "11px", background: paying ? "#a5b4fc" : "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
            {paying ? "Submitting..." : "Submit Payment"}
          </button>
          <button onClick={onClose} style={{ padding: "11px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            Pay Later
          </button>
        </div>
        <p style={{ color: "#9ca3af", fontSize: 11, textAlign: "center", marginTop: 12 }}>Payment will be verified by your counselor</p>
      </div>
    </div>
  );
}