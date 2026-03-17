import { useState } from "react";

const CompanyLogo = ({ name }) => {
  const logos = {
    Google: (
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    Microsoft: (
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#F25022" d="M1 1h10.5v10.5H1z"/>
        <path fill="#7FBA00" d="M12.5 1H23v10.5H12.5z"/>
        <path fill="#00A4EF" d="M1 12.5h10.5V23H1z"/>
        <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z"/>
      </svg>
    ),
    Amazon: (
      <svg width="16" height="16" viewBox="0 0 48 48">
        <path fill="#FF9900" d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4zm9.5 28.5c-2.5 1.7-5.5 2.5-8.5 2.5-4 0-7.8-1.5-10.6-4-.3-.2 0-.5.3-.3 3 1.8 6.4 2.8 9.8 2.8 2.6 0 5.5-.5 8-1.6.4-.2.7.3.3.6z"/>
        <path fill="#FF9900" d="M34.7 31.3c-.4-.5-2.5-.2-3.5-.1-.3 0-.3-.2-.1-.4 1.7-1.2 4.5-.8 4.8-.5.3.4-.1 3.2-1.7 4.5-.2.2-.5.1-.4-.2.4-.9 1.3-2.8.9-3.3z"/>
      </svg>
    ),
    Flipkart: (
      <svg width="16" height="16" viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#F74F00"/>
        <path fill="#fff" d="M7 6h3v5h3V6h3v12h-3v-5h-3v5H7z"/>
      </svg>
    ),
    Accenture: (
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#A100FF" d="M16.5 12L24 0H9l7.5 12zM7.5 24L0 12l7.5-12L15 12z"/>
      </svg>
    ),
    Infosys: (
      <svg width="16" height="16" viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#007CC3"/>
        <text x="2" y="16" fontSize="7" fontWeight="700" fill="#fff" fontFamily="Arial">INFOSYS</text>
      </svg>
    ),
    IBM: (
      <svg width="16" height="16" viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#1F70C1"/>
        <text x="3" y="16" fontSize="10" fontWeight="900" fill="#fff" fontFamily="Arial">IBM</text>
      </svg>
    ),
    Deloitte: (
      <svg width="16" height="16" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#86BC25"/>
        <circle cx="12" cy="12" r="5" fill="#fff"/>
      </svg>
    ),
  };
  return logos[name] || (
    <div style={{ width: 16, height: 16, borderRadius: 3, background: "#1429D0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, color: "#fff" }}>
      {name[0]}
    </div>
  );
};

const companies = [
  { name: "Google" }, { name: "Microsoft" }, { name: "Amazon" },
  { name: "Flipkart" }, { name: "Accenture" }, { name: "Infosys" },
  { name: "IBM" }, { name: "Deloitte" },
];

export default function CTASection() {
  const [formData, setFormData] = useState({
    fullName: "", email: "", countryCode: "+91", phone: "", program: "Not Sure Yet",
  });
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for registering! We will contact you soon.");
    setFormData({ fullName: "", email: "", countryCode: "+91", phone: "", program: "Not Sure Yet" });
  };

  const inputBase = (name) => ({
    width: "100%",
    padding: "14px 13px",
    // 16px prevents iOS Safari from auto-zooming on input focus
    fontSize: "16px",
    fontFamily: "'DM Sans', sans-serif",
    border: `1.5px solid ${focused === name ? "#1429D0" : "rgba(20,41,208,0.15)"}`,
    borderRadius: "8px",
    background: "#fff",
    color: "#161619",
    outline: "none",
    boxSizing: "border-box",
    boxShadow: focused === name ? "0 0 0 3px rgba(20,41,208,0.09)" : "none",
    transition: "all 0.2s ease",
    display: "block",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        .dp-cta-section *,
        .dp-cta-section *::before,
        .dp-cta-section *::after { box-sizing: border-box; }

        @keyframes ctaScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .dp-cta-track {
          display: flex !important;
          gap: 10px;
          width: fit-content;
          animation: ctaScroll 18s linear infinite;
        }
        .dp-cta-scrollwrap:hover .dp-cta-track {
          animation-play-state: paused;
        }
        .dp-cta-submitbtn:hover {
          background: #0e1fb0 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 28px rgba(20,41,208,0.38) !important;
        }

        /* ── Two-column layout ── */
        .dp-cta-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 64px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        /* ── Tablet (≤1024px): stack columns ── */
        @media (max-width: 1024px) {
          .dp-cta-grid {
            grid-template-columns: 1fr;
            gap: 48px;
            padding: 0 32px;
          }
        }

        /* ── Mobile (≤600px) ── */
        @media (max-width: 600px) {
          .dp-cta-grid { padding: 0 16px; gap: 36px; }
          .dp-cta-form-box { padding: 32px 20px !important; }
          .dp-cta-phone-row { flex-direction: column !important; }
          .dp-cta-phone-row select { width: 100% !important; }
        }

        /* ── Very small phones (≤380px) ── */
        @media (max-width: 380px) {
          .dp-cta-form-box { padding: 24px 16px !important; }
        }
      `}</style>

      <section id="contact" className="dp-cta-section" style={{
        padding: "90px 0",
        background: "#F5F7FA",
        position: "relative",
        fontFamily: "'DM Sans', sans-serif",
        overflow: "clip",
      }}>

        {/* Blobs */}
        <div style={{ position: "absolute", top: -60, right: -50, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,41,208,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,127,221,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div className="dp-cta-grid">

          {/* ── LEFT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 22, height: 2, background: "#1429D0", borderRadius: 2, display: "block", flexShrink: 0 }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1429D0", letterSpacing: "2px", textTransform: "uppercase" }}>Start Your Journey</span>
            </div>

            <h2 style={{ fontSize: "clamp(1.7rem, 3vw, 2.6rem)", fontWeight: 900, color: "#161619", lineHeight: 1.15, letterSpacing: "-0.03em", margin: 0 }}>
              Transform your career with programs{" "}
              <span style={{ color: "#1429D0" }}>that helped 12,000+</span>{" "}
             professionals land top roles.
            </h2>

            <p style={{ fontSize: "1rem", color: "#36383e", lineHeight: 1.75, margin: 0 }}>
              Book a free counselling session today. No commitments — just a conversation about your goals and how we can help.
            </p>

            {/* Scroll strip */}
            <div
              className="dp-cta-scrollwrap"
              style={{ position: "relative", overflow: "hidden", width: "100%", height: 46, display: "flex", alignItems: "center" }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(90deg, #F5F7FA, transparent)", zIndex: 2, pointerEvents: "none" }} />
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(270deg, #F5F7FA, transparent)", zIndex: 2, pointerEvents: "none" }} />
              <div className="dp-cta-track">
                {[...companies, ...companies].map((c, i) => (
                  <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: "1.5px solid rgba(20,41,208,0.12)", padding: "7px 13px", borderRadius: 100, fontSize: "0.8rem", fontWeight: 600, color: "#262832", whiteSpace: "nowrap", flexShrink: 0, boxShadow: "0 2px 8px rgba(20,41,208,0.07)" }}>
                    <CompanyLogo name={c.name} />
                    {c.name}
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT — FORM ── */}
          <div
            className="dp-cta-form-box"
            style={{
              background: "#F2F5FF",
              borderRadius: 22,
              padding: "40px 32px",
              boxShadow: "0 8px 40px rgba(20,41,208,0.12)",
              border: "1.5px solid rgba(20,41,208,0.12)",
              minWidth: 0,
            }}
          >
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#161619", margin: "0 0 24px", textAlign: "center", lineHeight: 1.4 }}>
              Upgrade Your Skills to Achieve Your Dream Job
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#262832" }}>Full Name</label>
                <input
                  type="text" name="fullName" placeholder="John Doe"
                  value={formData.fullName} onChange={handleChange}
                  onFocus={() => setFocused("fullName")} onBlur={() => setFocused(null)}
                  required style={inputBase("fullName")}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#262832" }}>Email Address</label>
                <input
                  type="email" name="email" placeholder="abc@gmail.com"
                  value={formData.email} onChange={handleChange}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  required style={inputBase("email")}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#262832" }}>Contact Number</label>
                {/* dp-cta-phone-row: stacks to column on very small phones */}
                <div className="dp-cta-phone-row" style={{ display: "flex", gap: 8 }}>
                  <select
                    name="countryCode" value={formData.countryCode} onChange={handleChange}
                    onFocus={() => setFocused("cc")} onBlur={() => setFocused(null)}
                    style={{ ...inputBase("cc"), width: 90, flexShrink: 0, cursor: "pointer" }}
                  >
                    <option value="+91">IN +91</option>
                    <option value="+1">US +1</option>
                    <option value="+44">UK +44</option>
                    <option value="+86">CN +86</option>
                  </select>
                  <input
                    type="tel" name="phone" placeholder="81234 56789"
                    value={formData.phone} onChange={handleChange}
                    onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                    required style={{ ...inputBase("phone"), flex: 1 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#262832" }}>Program Preference</label>
                <select
                  name="program" value={formData.program} onChange={handleChange}
                  onFocus={() => setFocused("program")} onBlur={() => setFocused(null)}
                  style={{ ...inputBase("program"), cursor: "pointer" }}
                >
                  <option>Not Sure Yet</option>
                  <option>Data Analytics</option>
                  <option>Business Analytics</option>
                  <option>Data Science and AI</option>
                  <option>Agentic AI &amp; Prompt Engineering</option>
                  <option>Investment Banking</option>
                </select>
              </div>

              <button
                type="submit"
                className="dp-cta-submitbtn"
                style={{
                  width: "100%", padding: "14px 20px",
                  fontSize: "0.95rem", fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#fff", background: "#1429D0",
                  border: "none", borderRadius: 10, cursor: "pointer",
                  marginTop: 4, boxShadow: "0 4px 20px rgba(20,41,208,0.28)",
                  transition: "all 0.22s ease",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Book Free Counselling →
              </button>
            </form>
          </div>

        </div>
      </section>
    </>
  );
}