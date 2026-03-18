import { useInView } from "../../hooks/useInView";
import { FiCheck, FiX, FiClipboard } from 'react-icons/fi';
import EnrollModal from "../../components/EnrollModel";
import { useState } from "react";

export default function Eligibility({ course }) {
  const [ref, inView] = useInView(0.1);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* // Enroll modal outside the main section to avoid z-index and overflow issues */}
      < EnrollModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes eligFloat {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-14px) rotate(5deg); }
        }
        /* ── Tablet (≤ 900px) ── */
        @media (max-width: 900px) {
          .dp-elig-grid    { grid-template-columns: 1fr 1fr !important; }
          .dp-elig-section { padding: 72px 5% !important; }
        }

        /* ── Large mobile (≤ 640px) ── */
        @media (max-width: 640px) {
          .dp-elig-grid    { grid-template-columns: 1fr !important; gap: 1.25rem !important; }
          .dp-elig-section { padding: 56px 5% !important; }
          .dp-elig-header  { margin-bottom: 2.5rem !important; }
          .dp-elig-card    { padding: 1.5rem !important; }
        }

        /* ── Small mobile (≤ 400px) ── */
        @media (max-width: 400px) {
          .dp-elig-section { padding: 44px 4% !important; }
          .dp-elig-grid    { gap: 1rem !important; }
          .dp-elig-card    { padding: 1.25rem !important; border-radius: 18px !important; }
        }
      `}</style>

      <section ref={ref} className="dp-elig-section" style={{
        fontFamily: "'DM Sans', sans-serif",
        padding: "90px 5%",
        background: "#F5F7FA",
        borderTop: "1px solid rgba(20,41,208,0.08)",
        borderBottom: "1px solid rgba(20,41,208,0.08)",
        position: "relative", overflow: "hidden",
      }}>

        {/* Blobs only — no grid */}
        <div style={{ position: "absolute", top: "15%", right: "6%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,41,208,0.07) 0%, transparent 70%)", animation: "eligFloat 6s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "12%", left: "4%", width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,127,221,0.06) 0%, transparent 70%)", animation: "eligFloat 8s ease-in-out infinite 0.5s", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Header */}
          <div className="dp-elig-header" style={{
            textAlign: "center", marginBottom: "4rem",
            opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "all 0.6s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: "1.1rem" }}>
              <span style={{ width: 22, height: 2, background: "#1429D0", borderRadius: 2, display: "inline-block" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1429D0", letterSpacing: "2.5px", textTransform: "uppercase" }}>
                Eligibility Check
              </span>
              <span style={{ width: 22, height: 2, background: "#1429D0", borderRadius: 2, display: "inline-block" }} />
            </div>
            <h2 style={{
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900,
              color: "#161619", lineHeight: 1.1, letterSpacing: "-0.03em",
            }}>
              Is This Program for{" "}
              <span style={{
                background: "linear-gradient(135deg, #1429D0, #0E7FDD)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>You?</span>
            </h2>
          </div>

          <div className="dp-elig-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>

            {/* ── This IS for you ── */}
            <div className="dp-elig-card" style={{
              background: "#fff", borderRadius: 24, padding: "2rem",
              border: "1.5px solid #DCFCE7",
              boxShadow: "0 4px 20px rgba(5,150,105,0.07)",
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "all 0.6s 0.1s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                  <FiCheck size={20} />
                </div>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#059669" }}>This IS for you if…</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem", margin: 0, padding: 0 }}>
                {course.forYou.map((item, i) => (
                  <li key={i} style={{
                    display: "flex", gap: "0.75rem", alignItems: "flex-start",
                    opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(-12px)",
                    transition: `all 0.4s ${0.15 + i * 0.08}s ease`,
                  }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#DCFCE7", border: "2px solid #059669", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669", flexShrink: 0, marginTop: 2 }}>
                      <FiCheck size={11} />
                    </span>
                    <span style={{ fontSize: "0.88rem", color: "#36383e", lineHeight: 1.55 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── NOT for you ── */}
            <div className="dp-elig-card" style={{
              background: "#fff", borderRadius: 24, padding: "2rem",
              border: "1.5px solid #FEE2E2",
              boxShadow: "0 4px 20px rgba(220,38,38,0.06)",
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "all 0.6s 0.2s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626" }}>
                  <FiX size={20} />
                </div>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#DC2626" }}>Skip this if…</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem", margin: 0, padding: 0 }}>
                {course.notForYou.map((item, i) => (
                  <li key={i} style={{
                    display: "flex", gap: "0.75rem", alignItems: "flex-start",
                    opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(-12px)",
                    transition: `all 0.4s ${0.25 + i * 0.08}s ease`,
                  }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#FEE2E2", border: "2px solid #DC2626", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626", flexShrink: 0, marginTop: 2 }}>
                      <FiX size={11} />
                    </span>
                    <span style={{ fontSize: "0.88rem", color: "#36383e", lineHeight: 1.55 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Requirements ── */}
            <div className="dp-elig-card" style={{
              background: "#fff", borderRadius: 24, padding: "2rem",
              border: "1.5px solid rgba(20,41,208,0.14)",
              boxShadow: "0 4px 20px rgba(20,41,208,0.07)",
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "all 0.6s 0.3s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F2F5FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#1429D0", border: "1px solid rgba(20,41,208,0.14)" }}>
                  <FiClipboard size={20} />
                </div>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#262832" }}>Requirements</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem", margin: 0, padding: 0 }}>
                {course.requirements.map((item, i) => (
                  <li key={i} style={{
                    display: "flex", gap: "0.75rem", alignItems: "flex-start",
                    opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(-12px)",
                    transition: `all 0.4s ${0.35 + i * 0.08}s ease`,
                  }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#F2F5FF", border: "2px solid #1429D0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#1429D0", fontWeight: 900, flexShrink: 0, marginTop: 2 }}>→</span>
                    <span style={{ fontSize: "0.88rem", color: "#36383e", lineHeight: 1.55 }}>{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div style={{
                marginTop: "1.5rem", padding: "1rem", borderRadius: 12,
                background: "#F2F5FF", border: "1px solid rgba(20,41,208,0.12)",
                textAlign: "center",
              }}>
                <p style={{ fontSize: "0.82rem", color: "#36383e", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                  Not sure if you qualify?
                </p>
                <button
                  style={{
                    padding: "0.6rem 1.4rem", borderRadius: 8, border: "none",
                    background: "#1429D0", color: "#fff",
                    fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 14px rgba(20,41,208,0.25)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.background = "#1E3A8A"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "#1429D0"; }}
                  onClick={() => setModalOpen(true)}
                 >
                  Talk to an Advisor
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}