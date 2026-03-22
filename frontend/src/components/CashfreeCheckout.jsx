import { useState, useEffect } from "react";
import API from "../api/axiosInstance";

// Load Cashfree JS SDK dynamically
function loadCashfreeSDK(env) {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) return resolve(window.Cashfree);
    const script = document.createElement("script");
    script.src = env === "production"
      ? "https://sdk.cashfree.com/js/v3/cashfree.js"
      : "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload  = () => resolve(window.Cashfree);
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.head.appendChild(script);
  });
}

const PAYMENT_MODES = [
  { id: "upi",    label: "UPI",         icon: "📱", desc: "Google Pay, PhonePe, Paytm", methods: "upi" },
  { id: "card",   label: "Debit/Credit Card", icon: "💳", desc: "Visa, Mastercard, RuPay", methods: "cc,dc" },
  { id: "nb",     label: "Net Banking",  icon: "🏦", desc: "All major banks", methods: "nb" },
  { id: "wallet", label: "Wallet",       icon: "👛", desc: "Paytm, Amazon Pay", methods: "wallet" },
];

export default function CashfreeCheckout({ invoice, onSuccess, onClose }) {
  const [selectedMode, setSelectedMode] = useState("upi");
  const [amount,       setAmount]       = useState("");
  const [payMode,      setPayMode]      = useState("FULL"); // FULL | PARTIAL
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [verifying,    setVerifying]    = useState(false);

  const remaining = invoice.totalAmount - invoice.amountPaid;
  const payAmount = payMode === "FULL" ? remaining : Number(amount);

  // Check if redirected back from Cashfree
  useEffect(() => {
    const params  = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");
    const status  = params.get("status");
    if (orderId && status) {
      // Clear URL params
      window.history.replaceState({}, "", window.location.pathname);
      if (status === "SUCCESS") handleVerify(orderId);
    }
  }, []);

  const handleVerify = async (orderId) => {
    setVerifying(true);
    try {
      const res = await API.post("/payments/cashfree/verify", {
        orderId,
        invoiceId: invoice._id,
      });
      if (res.data.success) {
        onSuccess?.();
      } else {
        setError(`Payment ${res.data.status || "failed"}. Please try again.`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Verification failed");
    } finally { setVerifying(false); }
  };

  const handlePay = async () => {
    if (payMode === "PARTIAL" && (!payAmount || payAmount <= 0)) {
      return setError("Enter a valid amount");
    }
    if (payAmount > remaining) {
      return setError(`Max payable: ₹${remaining.toLocaleString("en-IN")}`);
    }

    setLoading(true); setError("");
    try {
      // 1. Create order on backend
      const res = await API.post("/payments/cashfree/create-order", {
        invoiceId:   invoice._id,
        amount:      payAmount,
        paymentMode: PAYMENT_MODES.find(m => m.id === selectedMode)?.methods,
      });

      const { paymentSessionId, orderId, cashfreeEnv } = res.data.data;

      // 2. Load Cashfree SDK
      await loadCashfreeSDK(cashfreeEnv);

      const cashfree = window.Cashfree({ mode: cashfreeEnv || "sandbox" });

      // 3. Open Cashfree checkout
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      }).then(async (result) => {
        if (result.error) {
          setError(result.error.message || "Payment failed");
        } else if (result.redirect) {
          // Will verify on redirect back
        } else if (result.paymentDetails) {
          // Payment done in modal — verify now
          await handleVerify(orderId);
        }
      });

    } catch (err) {
      setError(err?.response?.data?.message || "Could not initiate payment");
    } finally { setLoading(false); }
  };

  if (verifying) {
    return (
      <div style={overlay}>
        <div style={card}>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <h3 style={{ margin: "0 0 8px" }}>Verifying Payment…</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Please wait while we confirm your payment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClose} style={overlay}>
      <div onClick={e => e.stopPropagation()} style={card}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Complete Payment</h2>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>
              {invoice.enrollment?.batch?.course?.title || "Course Fee"}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#6b7280" }}>✕</button>
        </div>

        {/* Amount info */}
        <div style={{ background: "#f0f4ff", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            <span>Total Fee</span><span>₹{invoice.totalAmount?.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            <span>Paid</span><span style={{ color: "#16a34a" }}>₹{invoice.amountPaid?.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#6366f1", borderTop: "1px solid #c7d2fe", paddingTop: 8, marginTop: 4 }}>
            <span>Due Now</span><span>₹{remaining?.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Full / Partial toggle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {["FULL", "PARTIAL"].map(m => (
            <button key={m} onClick={() => setPayMode(m)}
              style={{ padding: "10px", borderRadius: 8, border: `2px solid ${payMode === m ? "#6366f1" : "#e5e7eb"}`, background: payMode === m ? "#eff6ff" : "#fff", color: payMode === m ? "#6366f1" : "#374151", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              {m === "FULL" ? `Pay Full ₹${remaining?.toLocaleString("en-IN")}` : "Partial Payment"}
            </button>
          ))}
        </div>

        {payMode === "PARTIAL" && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
              Enter Amount (max ₹{remaining?.toLocaleString("en-IN")})
            </label>
            <input
              type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder={`e.g. ${Math.floor(remaining / 2)}`}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, boxSizing: "border-box" }}
            />
          </div>
        )}

        {/* Payment method selection */}
        <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: "0 0 10px" }}>Select Payment Method</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          {PAYMENT_MODES.map(mode => (
            <div key={mode.id} onClick={() => setSelectedMode(mode.id)}
              style={{ padding: "12px", borderRadius: 10, border: `2px solid ${selectedMode === mode.id ? "#6366f1" : "#e5e7eb"}`, background: selectedMode === mode.id ? "#eff6ff" : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{mode.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{mode.label}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>{mode.desc}</div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#dc2626" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Pay button */}
        <button onClick={handlePay} disabled={loading || (payMode === "PARTIAL" && !amount)}
          style={{ width: "100%", padding: "14px", background: loading ? "#a5b4fc" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", fontWeight: 800, fontSize: 16, boxShadow: "0 4px 12px rgba(99,102,241,0.35)" }}>
          {loading ? "Opening Payment…" : `Pay ₹${(payMode === "FULL" ? remaining : payAmount || 0)?.toLocaleString("en-IN")} Securely 🔒`}
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 10 }}>
          Secured by Cashfree Payments · UPI · Card · Net Banking
        </p>
      </div>
    </div>
  );
}

const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" };
const card    = { background: "#fff", borderRadius: 18, padding: "24px", width: "min(96vw,460px)", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.25)" };