import { useState } from "react";

// ─────────────────────────────────────────────────────────────
//  STEP 1: After deploying your Google Apps Script, paste the
//  Web App URL below (replace the placeholder).
//  Deploy → New Deployment → Web App → Execute as: Me → Anyone
// ─────────────────────────────────────────────────────────────
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export default function EnrollModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    program: "Not Sure Yet",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Google Apps Script requires no-cors when called from browser.
      // We fire-and-forget with no-cors, then optimistically show success.
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain", // Use text/plain to avoid CORS preflight
        },
        body: JSON.stringify(formData),
      });

      // With no-cors we can't read the response body, but if fetch didn't
      // throw the request was accepted. Show success state.
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again or WhatsApp us directly.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setLoading(false);
    setError("");
    setFormData({
      fullName: "",
      email: "",
      countryCode: "+91",
      phone: "",
      program: "Not Sure Yet",
    });
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: "100%",
    padding: "9px 11px",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    border: "1.5px solid rgba(20,41,208,0.15)",
    borderRadius: 8,
    background: "#fff",
    color: "#161619",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "#262832",
    display: "block",
    marginBottom: 4,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        .enroll-modal-box { animation: modalIn 0.22s cubic-bezier(.4,0,.2,1) both; }

        .enroll-submit-btn:hover:not(:disabled) {
          background: #0e1fb0 !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(20,41,208,0.38) !important;
        }
        .enroll-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .enroll-input:focus {
          border-color: #1429D0 !important;
          box-shadow: 0 0 0 3px rgba(20,41,208,0.09);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .enroll-spinner {
          display: inline-block;
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @media (max-width: 520px) {
          .enroll-modal-box    { border-radius: 16px !important; }
          .enroll-modal-header { padding: 1rem 1.1rem !important; }
          .enroll-modal-body   { padding: 1.1rem !important; }
        }
        @media (max-width: 360px) {
          .enroll-phone-row             { flex-direction: column !important; }
          .enroll-phone-row select      { width: 100% !important; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2000,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          className="enroll-modal-box"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#F2F5FF",
            borderRadius: 18,
            width: "100%",
            maxWidth: 420,
            boxShadow: "0 24px 80px rgba(20,41,208,0.2)",
            border: "1.5px solid rgba(20,41,208,0.12)",
            overflow: "hidden",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* ── Header ── */}
          <div
            className="enroll-modal-header"
            style={{
              background: "#1429D0",
              padding: "1rem 1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: 3,
              }}>
                Free Session
              </div>
              <div style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 800, lineHeight: 1.3 }}>
                Upgrade Your Skills to Achieve<br />Your Dream Job
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#fff",
                width: 26,
                height: 26,
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginLeft: 10,
              }}
            >
              ✕
            </button>
          </div>

          {/* ── Body ── */}
          <div className="enroll-modal-body" style={{ padding: "1.25rem" }}>

            {/* ── Success state ── */}
            {submitted ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(16,185,129,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "1.6rem",
                }}>
                  ✅
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#161619", marginBottom: 6 }}>
                  You're all set, {formData.fullName.split(" ")[0]}!
                </div>
                <div style={{ fontSize: "0.85rem", color: "#6B7280", lineHeight: 1.6 }}>
                  Check your inbox — a confirmation email is<br />on its way from DataPreneur.
                </div>
                <div style={{
                  marginTop: 16,
                  padding: "10px 14px",
                  background: "#EEF1FF",
                  borderRadius: 8,
                  fontSize: "0.8rem",
                  color: "#1429D0",
                  fontWeight: 600,
                }}>
                  Our counsellor will reach out within 24 hours
                </div>
              </div>

            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>

                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    className="enroll-input"
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    className="enroll-input"
                    type="email"
                    name="email"
                    placeholder="abc@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Contact Number</label>
                  <div className="enroll-phone-row" style={{ display: "flex", gap: 7 }}>
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      style={{ ...inputStyle, width: 90, flexShrink: 0 }}
                    >
                      <option value="+91">IN +91</option>
                      <option value="+1">US +1</option>
                      <option value="+44">UK +44</option>
                      <option value="+86">CN +86</option>
                    </select>
                    <input
                      className="enroll-input"
                      type="tel"
                      name="phone"
                      placeholder="81234 56789"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      style={{ ...inputStyle, flex: 1 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Program Preference</label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option>Not Sure Yet</option>
                    <option>Data Analytics</option>
                    <option>Business Analytics</option>
                    <option>Data Science and AI</option>
                    <option>Agentic AI &amp; Prompt Engineering</option>
                    <option>Investment Banking</option>
                  </select>
                </div>

                {/* Error message */}
                {error && (
                  <div style={{
                    background: "#FEE2E2",
                    border: "1px solid #FECACA",
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontSize: "0.8rem",
                    color: "#DC2626",
                    fontWeight: 500,
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="enroll-submit-btn"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: 9,
                    border: "none",
                    background: "#1429D0",
                    color: "#fff",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    marginTop: 2,
                    boxShadow: "0 4px 20px rgba(20,41,208,0.28)",
                    transition: "all 0.22s ease",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {loading ? (
                    <><span className="enroll-spinner" />Submitting…</>
                  ) : (
                    "Book Free Counselling →"
                  )}
                </button>

                <p style={{ fontSize: "0.7rem", color: "#94A3B8", textAlign: "center", margin: 0 }}>
                  No spam. No commitments. Just a conversation.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}