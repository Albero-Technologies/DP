import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EnrollModal from "../../components/EnrollModel";

export default function ProgramHero({ course }) {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setVisible(true);
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const parallax = scrollY * 0.25;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes heroBlob1 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.05)} }
        @keyframes heroBlob2 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(20px) scale(.95)} }

        /* Grid overlay — matches main HeroSection */
        .dp-ph-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(20,41,208,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,41,208,0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 90% 90% at 50% 0%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 0%, black 40%, transparent 100%);
        }

        .dp-hero-enroll-btn:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 14px 36px rgba(20,41,208,0.42) !important;
        }
        .dp-hero-session-btn:hover {
          border-color: #1429D0 !important;
          color: #1429D0 !important;
          background: #F2F5FF !important;
        }
        .dp-hero-card-enroll:hover { transform: translateY(-2px) !important; }
        .dp-hero-card-counsel:hover { background: #e8eeff !important; }

        /* ── Tablet (≤ 960px) ── */
        @media (max-width: 960px) {
          .dp-hero-layout { grid-template-columns: 1fr !important; }
          .dp-ph-right-card { max-width: 480px; margin: 0 auto; width: 100%; }
        }

        /* ── Large mobile (≤ 640px) ── */
        @media (max-width: 640px) {
          .dp-hero-ctas { flex-direction: column !important; }
          .dp-hero-ctas button { width: 100%; }
          .dp-hero-stats { gap: 1.5rem !important; flex-wrap: wrap !important; }
          .dp-ph-section { padding: 100px 5% 60px !important; }
          .dp-ph-breadcrumb { margin-bottom: 1.4rem !important; }
        }

        /* ── Small mobile (≤ 400px) ── */
        @media (max-width: 400px) {
          .dp-ph-section { padding: 88px 4% 48px !important; }
          .dp-hero-stats { gap: 1.2rem !important; }
          .dp-ph-right-card { padding: 1.5rem !important; }
        }
      `}</style>
{/* // Enroll modal outside the main section to avoid z-index and overflow issues */}

      < EnrollModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <section className="dp-ph-section" style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "120px 5% 80px",
        position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #F2F5FF 0%, #F5F7FA 60%, #ffffff 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── Grid overlay ── */}
        <div className="dp-ph-grid" />

        {/* ── Blobs only — no grid ── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{
            position: "absolute", width: 650, height: 650, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,41,208,0.10) 0%, transparent 70%)",
            top: "0%", right: "-8%",
            transform: `translateY(${parallax}px)`,
            transition: "transform .1s linear",
            animation: "heroBlob1 8s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", width: 480, height: 480, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,127,221,0.07) 0%, transparent 70%)",
            bottom: "8%", left: "-4%",
            transform: `translateY(-${parallax * 0.6}px)`,
            transition: "transform .1s linear",
            animation: "heroBlob2 10s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(191,210,255,0.25) 0%, transparent 70%)",
            top: "60%", right: "25%",
          }} />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Breadcrumb */}
          <div className="dp-ph-breadcrumb" style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(10px)",
            transition: "all 0.4s ease",
          }}>
            <Link to="/" style={{ color: "#1429D0", textDecoration: "none", fontWeight: 600 }}>Home</Link>
            <span style={{ color: "#94A3B8" }}>›</span>
            <Link to="/#programs" style={{ color: "#1429D0", textDecoration: "none", fontWeight: 600 }}>Programs</Link>
            <span style={{ color: "#94A3B8" }}>›</span>
            <span style={{ color: "#94A3B8" }}>{course.title}</span>
          </div>

          <div className="dp-hero-layout" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "4rem", alignItems: "center" }}>

            {/* ── LEFT CONTENT ── */}
            <div>
              {/* Tags */}
              <div style={{
                display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem",
                opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.5s 0.1s ease",
              }}>
                <span style={{
                  padding: "0.45rem 1.1rem", borderRadius: 100,
                  background: "#F2F5FF", color: "#1429D0",
                  fontSize: "0.78rem", fontWeight: 700,
                  border: "1.5px solid rgba(20,41,208,0.20)",
                }}>
                  {course.tag}
                </span>
                {course.badge && (
                  <span style={{
                    padding: "0.45rem 1.1rem", borderRadius: 100,
                    background: "#161619", color: "#fff",
                    fontSize: "0.78rem", fontWeight: 700,
                  }}>
                    {course.badge}
                  </span>
                )}
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: "clamp(2.2rem, 3.5vw, 3.4rem)", fontWeight: 900,
                lineHeight: 1.15, letterSpacing: "-0.03em",
                color: "#161619", marginBottom: "1.5rem",
                opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.6s 0.15s ease",
              }}>
                {course.title}
                <br />
                <span style={{
                  background: "linear-gradient(135deg, #1429D0, #0E7FDD)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {course.subtitle.split(" ").slice(-3).join(" ")}
                </span>
              </h1>

              {/* Description */}
              <p style={{
                fontSize: "1.05rem", color: "#36383e", lineHeight: 1.8,
                maxWidth: 560, marginBottom: "2.5rem",
                opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)", transition: "all 0.5s 0.25s ease",
              }}>
                {course.longDesc}
              </p>

              {/* CTAs */}
              <div className="dp-hero-ctas" style={{
                display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem",
                opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)", transition: "all 0.5s 0.35s ease",
              }}>
                <button
                  className="dp-hero-enroll-btn"
                  style={{
                    padding: "0.95rem 2.2rem", borderRadius: 12, border: "none",
                    background: "#1429D0", color: "#fff",
                    fontSize: "1rem", fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(20,41,208,0.32)",
                    transition: "all 0.25s ease",
                  }}
                  onClick={()=> setModalOpen(true)}>
                  Enroll Now — {course.price}
                </button>
                <button
                  className="dp-hero-session-btn"
                  style={{
                    padding: "0.95rem 2.2rem", borderRadius: 12,
                    border: "1.5px solid rgba(20,41,208,0.20)",
                    background: "#fff", color: "#262832",
                    fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                  onClick={() => setModalOpen(true)}
                >
                  Book Free Session
                </button>
              </div>

              {/* Stats */}
              <div className="dp-hero-stats" style={{
                display: "flex", gap: "2.5rem", flexWrap: "wrap",
                opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)", transition: "all 0.5s 0.45s ease",
              }}>
                {course.heroStats.map((s, i) => (
                  <div key={i}>
                    <div style={{
                      fontSize: "2.2rem", fontWeight: 900,
                      color: "#1429D0", lineHeight: 1,
                      letterSpacing: "-0.03em",
                    }}>
                      {s.num}{s.suffix}
                    </div>
                    <div style={{ fontSize: "0.77rem", color: "#94A3B8", marginTop: "0.25rem", fontWeight: 500 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT CARD ── */}
            <div style={{
              opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(30px)", transition: "all 0.7s 0.3s ease",
            }}>
              <div className="dp-ph-right-card" style={{
                background: "#fff",
                borderRadius: 24, padding: "2rem",
                border: "1.5px solid rgba(20,41,208,0.12)",
                boxShadow: "0 24px 70px rgba(20,41,208,0.10)",
              }}>
                {/* Price */}
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.32rem 1rem", borderRadius: 100,
                    background: "#F2F5FF", marginBottom: "0.7rem",
                    border: "1px solid rgba(20,41,208,0.12)",
                  }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#1429D0", letterSpacing: "2px", textTransform: "uppercase" }}>
                      Program Fee
                    </span>
                  </div>
                  <div style={{ fontSize: "3rem", fontWeight: 900, color: "#161619", lineHeight: 1, letterSpacing: "-0.04em" }}>
                    {course.price}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "0.4rem" }}>
                    EMI from ₹3,000/month · 0% interest
                  </div>
                </div>

                {/* Info rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
                  {[
                    [
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1429D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                      "Duration", course.duration,
                    ],
                    [
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1429D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polygon points="10 8 16 11 10 14 10 8"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
                      "Format", course.mode,
                    ],
                    [
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1429D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="7" r="3"/><circle cx="16" cy="7" r="3"/><path d="M2 21v-1a6 6 0 0 1 6-6h1"/><path d="M22 21v-1a6 6 0 0 0-6-6h-1"/></svg>,
                      "Batch Size", "Max 25 students",
                    ],
                    [
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1429D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5"/><polyline points="9 9 11 11 15 7"/><path d="M15.477 13.89 17 22l-5-3-5 3 1.523-8.11"/></svg>,
                      "Certificate", "Industry Recognized",
                    ],
                  ].map(([ic, k, v]) => (
                    <div key={k} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "0.6rem 0.85rem", borderRadius: 10,
                      background: "#F5F7FA",
                      border: "1px solid rgba(20,41,208,0.07)",
                    }}>
                      <span style={{ fontSize: "0.83rem", color: "#36383e", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {ic} {k}
                      </span>
                      <span style={{ fontSize: "0.83rem", fontWeight: 700, color: "#262832" }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Card CTAs */}
                <button
                  className="dp-hero-card-enroll"
                  style={{
                    width: "100%", padding: "0.9rem", borderRadius: 12, border: "none",
                    background: "#1429D0", color: "#fff",
                    fontSize: "0.95rem", fontWeight: 700, cursor: "pointer",
                    marginBottom: "0.65rem",
                    boxShadow: "0 6px 20px rgba(20,41,208,0.28)",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => setModalOpen(true)}
                  >
                  Enroll Now
                </button>
                <button
                  className="dp-hero-card-counsel"
                  style={{
                    width: "100%", padding: "0.82rem", borderRadius: 12,
                    border: "1.5px solid rgba(20,41,208,0.25)",
                    background: "#F2F5FF", color: "#1429D0",
                    fontSize: "0.9rem", fontWeight: 700, cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => setModalOpen(true)}
                 >
                  Book Free Counselling
                </button>

                <p style={{
                  textAlign: "center", fontSize: "0.73rem", color: "#94A3B8",
                  marginTop: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Secure checkout · No spam · EMI available
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}