import { useState } from "react";
import { useInView, useCounter } from "../../hooks/useInView";
import EnrollModal from "../../components/EnrollModel";
// import { useState } from "react";

const GLOBAL_STATS = [
  { num: 2400, suffix: "+", label: "Students Placed" },
  { num: 94,   suffix: "%", label: "Placement Rate"  },
  { num: 180,  suffix: "+", label: "Hiring Partners" },
  { num: 49,   suffix: "k", label: "Avg. Salary (LPA)" },
];

// Realistic SVG icons for global stats
const StatIcons = [
  // Graduation cap
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <polygon points="12,2 22,8 12,14 2,8" fill="rgba(191,210,255,0.25)" stroke="#BFD2FF" strokeWidth="1.4"/>
    <path d="M6 10.5v5c0 0 2.5 2.5 6 2.5s6-2.5 6-2.5v-5" stroke="#BFD2FF" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="22" y1="8" x2="22" y2="14" stroke="#BFD2FF" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  // Trend arrow
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <polyline points="2,17 8,11 13,15 22,5" stroke="#BFD2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16,5 22,5 22,11" stroke="#BFD2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  // Handshake
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M4 11.5L8.5 7H12l2 2h2.5L21 12.5l-3 3-2-1-3 2.5-2-1-2 1.5L4 15v-3.5z" stroke="#BFD2FF" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M4 11.5L2 13l3.5 4 1.5-1" stroke="#BFD2FF" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M21 12.5l1 1.5-3.5 4-1.5-1" stroke="#BFD2FF" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>,
  // Coin / salary
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#BFD2FF" strokeWidth="1.5"/>
    <path d="M12 6v12M9 8.5c0-1.1 1.35-2 3-2s3 .9 3 2-1.35 2-3 2-3 .9-3 2 1.35 2 3 2 3-.9 3-2" stroke="#BFD2FF" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>,
];

// SVG icons for differentiators
const DiffIcons = [
  // People / cohort
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="9" cy="7" r="3"/><circle cx="17" cy="8" r="2.5"/>
    <path d="M2 20v-1a6 6 0 0 1 9-5.2"/><path d="M22 20v-1a5 5 0 0 0-5-5h-1"/>
  </svg>,
  // Database / datasets
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round">
    <ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/><path d="M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4"/>
  </svg>,
  // Mentor / mic
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="7" r="4"/><path d="M4 20v-1a8 8 0 0 1 16 0v1"/>
    <line x1="12" y1="11" x2="12" y2="13"/>
  </svg>,
  // Briefcase / placement
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="7" width="20" height="13" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <polyline points="9 13 11 15 15 11"/>
  </svg>,
  // Award / cert
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="9" r="5"/>
    <polyline points="9 9 11 11 15 7"/>
    <path d="M15.5 14L17 22l-5-2.5L7 22l1.5-8"/>
  </svg>,
  // Phone / support
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.69 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>,
];

const differentiators = [
  { title: "Tiny Cohorts (Max 25)",          desc: "Your mentor knows your name, not just your registration number. Real accountability, real results." },
  { title: "Real Company Datasets",           desc: "Every project uses data from actual companies — Swiggy, HDFC, Flipkart. Not toy datasets." },
  { title: "Industry Mentors, Not Teachers", desc: "Mentors are working professionals at FAANG and Big-4 who hire people like you." },
  { title: "Placement Until You're Hired",   desc: "We don't stop at program end. Resume reviews, referrals, and coaching until offer letter." },
  { title: "Globally Recognized Certs",      desc: "Microsoft, Google, LangChain — certificates that actually matter to recruiters." },
  { title: "Mentor-on-Call Anytime",          desc: "Stuck at 11pm on a project? Your mentor is reachable. We don't close at 5pm." },
];

function AnimNum({ target, inView }) {
  const v = useCounter(target, inView);
  return <>{v}</>;
}

function DiffRow({ d, icon, index, inView }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", gap: "1rem", alignItems: "flex-start",
        padding: "0.95rem 1.2rem", borderRadius: 14,
        background: hov ? "#fff" : "#F5F7FA",
        border: `1.5px solid ${hov ? "rgba(20,41,208,0.28)" : "rgba(20,41,208,0.09)"}`,
        boxShadow: hov ? "0 8px 24px rgba(20,41,208,0.09)" : "none",
        transition: "all 0.25s ease",
        cursor: "default",
        opacity: inView ? 1 : 0,
        transform: inView ? (hov ? "translateX(6px)" : "none") : "translateX(-20px)",
        transitionDelay: `${0.1 + index * 0.06}s`,
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: "#F2F5FF", border: "1px solid rgba(20,41,208,0.14)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transition: "transform 0.3s ease",
        transform: hov ? "scale(1.15) rotate(5deg)" : "none",
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#262832", marginBottom: "0.2rem" }}>{d.title}</div>
        <div style={{ fontSize: "0.82rem", color: "#36383e", lineHeight: 1.6 }}>{d.desc}</div>
      </div>
    </div>
  );
}

export default function WhyDataPreneur({ course }) {
  const [ref,      inView]      = useInView(0.1);
  const [refStats, inViewStats] = useInView(0.1);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Enroll modal outside the main section to avoid z-index and overflow issues */}
      <EnrollModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        /* ── Tablet (≤ 900px) ── */
        @media (max-width: 900px) {
          .dp-why-layout { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .dp-why-stats  { grid-template-columns: 1fr 1fr !important; gap: 1.5rem !important; padding: 2rem !important; }
          .dp-why-whydp  { grid-template-columns: 1fr 1fr !important; }
        }

        /* ── Large mobile (≤ 640px) ── */
        @media (max-width: 640px) {
          .dp-why-section   { padding: 60px 5% !important; }
          .dp-why-stats     { margin-top: 3.5rem !important; padding: 1.6rem 1.4rem !important; gap: 1.2rem !important; }
          .dp-why-whydp     { grid-template-columns: 1fr 1fr !important; gap: 0.75rem !important; }
          .dp-why-stat-num  { font-size: 2rem !important; }
          .dp-why-stat-lbl  { font-size: 0.75rem !important; }
        }

        /* ── Small mobile (≤ 400px) ── */
        @media (max-width: 400px) {
          .dp-why-section  { padding: 48px 4% !important; }
          .dp-why-stats    { grid-template-columns: 1fr 1fr !important; padding: 1.3rem 1rem !important; gap: 1rem !important; border-radius: 16px !important; }
          .dp-why-whydp    { grid-template-columns: 1fr !important; }
          .dp-why-stat-num { font-size: 1.75rem !important; }
        }
        .dp-why-cta:hover {
          transform: translateY(-2px) !important;
          background: #1E3A8A !important;
          box-shadow: 0 10px 28px rgba(20,41,208,0.36) !important;
        }
      `}</style>

      <section ref={ref} className="dp-why-section" style={{
        padding: "90px 5%",
        position: "relative", overflow: "hidden",
        background: "#ffffff",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Blobs */}
        <div style={{ position: "absolute", top: -60, right: -40, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,41,208,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -50, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,127,221,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="dp-why-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

            {/* ── LEFT ── */}
            <div>
              {/* Label */}
              <div style={{
                display: "flex", alignItems: "center", gap: 12, marginBottom: "1.1rem",
                opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(12px)", transition: "all 0.5s ease",
              }}>
                <span style={{ width: 22, height: 2, background: "#1429D0", borderRadius: 2, display: "inline-block" }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1429D0", letterSpacing: "2.5px", textTransform: "uppercase" }}>Why DataPreneur</span>
              </div>

              <h2 style={{
                fontSize: "clamp(1.9rem, 3vw, 2.7rem)", fontWeight: 900,
                color: "#161619", lineHeight: 1.1, letterSpacing: "-0.03em",
                marginBottom: "1rem",
                opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)", transition: "all 0.5s 0.1s ease",
              }}>
                We're Not a Course.<br />
                We're a{" "}
                <span style={{
                  background: "linear-gradient(135deg, #1429D0, #0E7FDD)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  Career Accelerator
                </span>
              </h2>

              <p style={{
                color: "#36383e", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "2rem",
                opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(12px)", transition: "all 0.5s 0.15s ease",
              }}>
                Built by people who've hired at Google, JPMorgan and Amazon — not by people who've just taught about it.
              </p>

              {/* Program-specific why points */}
              {course.whyDP && (
              <div className="dp-why-whydp" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                  {course.whyDP.map((w, i) => (
                    <div key={i} style={{
                      background: "#F5F7FA", borderRadius: 16, padding: "1.2rem",
                      border: "1.5px solid rgba(20,41,208,0.10)",
                      opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(12px)",
                      transition: `all 0.5s ${0.2 + i * 0.08}s ease`,
                    }}>
                      <div style={{
                        fontSize: "1.5rem", fontWeight: 900,
                        color: "#1429D0", letterSpacing: "-0.03em", lineHeight: 1,
                        marginBottom: "0.3rem",
                      }}>
                        {w.stat}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#262832" }}>{w.label}</div>
                      <div style={{ fontSize: "0.78rem", color: "#36383e", marginTop: "0.2rem", lineHeight: 1.5 }}>{w.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="dp-why-cta"
                style={{
                  padding: "0.85rem 2rem", borderRadius: 10, border: "none",
                  background: "#1429D0", color: "#fff",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(20,41,208,0.28)",
                  transition: "all 0.25s ease",
                  opacity: inView ? 1 : 0,
                }}
                onClick={() => setModalOpen(true)}
              >
                Start Your Journey →
              </button>
            </div>

            {/* ── RIGHT — differentiators ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {differentiators.map((d, i) => (
                <DiffRow key={i} d={d} icon={DiffIcons[i]} index={i} inView={inView} />
              ))}
            </div>
          </div>

          {/* ── Global stats bar ── */}
          <div
            ref={refStats}
            className="dp-why-stats"
            style={{
              marginTop: "5rem", padding: "2.5rem 3rem",
              background: "linear-gradient(135deg, #161619 0%, #1e2235 60%, #1429D0 100%)",
              borderRadius: 24,
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem",
              boxShadow: "0 20px 60px rgba(20,41,208,0.22)",
              opacity: inViewStats ? 1 : 0, transform: inViewStats ? "none" : "translateY(24px)", transition: "all 0.7s ease",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Inner blob accent */}
            <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,41,208,0.4) 0%, transparent 70%)", pointerEvents: "none" }} />

            {GLOBAL_STATS.map((s, i) => (
              <div key={i} style={{
                textAlign: "center", position: "relative", zIndex: 1,
                opacity: inViewStats ? 1 : 0, transform: inViewStats ? "none" : "translateY(16px)",
                transition: `all 0.5s ${i * 0.1}s ease`,
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
                  {StatIcons[i]}
                </div>
                <div className="dp-why-stat-num" style={{
                  fontSize: "2.5rem", fontWeight: 900, color: "#fff",
                  lineHeight: 1, letterSpacing: "-0.04em",
                }}>
                  <AnimNum target={s.num} inView={inViewStats} />{s.suffix}
                </div>
                <div className="dp-why-stat-lbl" style={{ fontSize: "0.82rem", color: "rgba(191,210,255,0.75)", marginTop: "0.3rem" }}>{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}