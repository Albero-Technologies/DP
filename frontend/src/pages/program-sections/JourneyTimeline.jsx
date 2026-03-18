import { useState } from "react";
import { useInView } from "../../hooks/useInView";
import EnrollModal from "../../components/EnrollModel";

// ── Journey step SVG icons — mapped by emoji key ──────────────────────────
const STEP_ICONS = {
  "🎯": ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="6"  stroke={color} strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="2"  fill={color}/>
    </svg>
  ),
  "📚": ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 19V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M4 19h16" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9 2v5M15 2v5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 12h8M8 15h5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  "🔨": ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="13" width="18" height="8" rx="2" stroke={color} strokeWidth="1.8"/>
      <rect x="8" y="3" width="8" height="10" rx="1.5" stroke={color} strokeWidth="1.8"/>
      <line x1="12" y1="13" x2="12" y2="21" stroke={color} strokeWidth="1.8"/>
    </svg>
  ),
  "👨‍🏫": ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.8"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M17 11l2 2 3-3" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "💼": ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="8" width="20" height="13" rx="2" stroke={color} strokeWidth="1.8"/>
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={color} strokeWidth="1.8"/>
      <line x1="2" y1="14" x2="22" y2="14" stroke={color} strokeWidth="1.8"/>
    </svg>
  ),
  "🏆": ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 21h8M12 17v4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M5 3H3v6c0 3.3 4 6 9 6s9-2.7 9-6V3h-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 3h14" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  "🎤": ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="11" rx="3" stroke={color} strokeWidth="1.8"/>
      <path d="M5 10a7 7 0 0 0 14 0" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="12" y1="17" x2="12" y2="21" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="8"  y1="21" x2="16" y2="21" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  "🤝": ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="7"  cy="8" r="3" stroke={color} strokeWidth="1.8"/>
      <circle cx="17" cy="8" r="3" stroke={color} strokeWidth="1.8"/>
      <path d="M1 20c0-3 2.7-5 6-5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M17 15c3.3 0 6 2 6 5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9 20c0-2.8 1.3-5 3-5s3 2.2 3 5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  "📊": ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3"  y="13" width="4" height="8" rx="1" fill={color} opacity=".5"/>
      <rect x="10" y="9"  width="4" height="12" rx="1" fill={color} opacity=".75"/>
      <rect x="17" y="5"  width="4" height="16" rx="1" fill={color}/>
      <line x1="2" y1="22" x2="22" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "💡": ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 21h6M12 3a7 7 0 0 1 4 12.74V17H8v-1.26A7 7 0 0 1 12 3z" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  "🚀": ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8 6 7 10 7 13l2 2c3 0 7-1 11-5 0-5-3-8-8-8z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M7 13l-3 5 5-3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="14" cy="10" r="1.5" fill={color}/>
    </svg>
  ),
  "💻": ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="14" rx="2" stroke={color} strokeWidth="1.8"/>
      <line x1="2" y1="20" x2="22" y2="20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 10l-2 2 2 2M16 10l2 2-2 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="9" x2="12" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

const FallbackIcon = ({ color, number }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8"/>
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill={color} fontFamily="DM Sans,sans-serif">{number}</text>
  </svg>
);

const StepIcon = ({ iconKey, color, index }) => {
  const Comp = STEP_ICONS[iconKey];
  if (Comp) return <Comp color={color} />;
  return <FallbackIcon color={color} number={index + 1} />;
};

export default function JourneyTimeline({ course }) {
  const [ref, inView]   = useInView(0.05);
  const [hovStep, setHovStep] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Enroll modal outside the main section to avoid z-index and overflow issues */}
      <EnrollModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @media (max-width: 700px) {
          .dp-journey-card {
            width: calc(100% - 3.5rem) !important;
            margin-left: 3.5rem !important;
            text-align: left !important;
            transform: none !important;
          }
          .dp-journey-node { left: 0 !important; transform: translate(0, -50%) !important; }
          .dp-journey-row  { justify-content: flex-start !important; }
        }
        .dp-journey-cta-btn:hover {
          transform: translateY(-3px) scale(1.02) !important;
          background: #1E3A8A !important;
          box-shadow: 0 12px 32px rgba(20,41,208,0.36) !important;
        }
      `}</style>

      <section ref={ref} style={{
        padding: "90px 5%",
        background: "#F5F7FA",
        position: "relative", overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Blobs — no grid */}
        <div style={{ position: "absolute", top: -60, left: -40, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,41,208,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: -40, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,127,221,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* ── Header ── */}
          <div style={{
            textAlign: "center", marginBottom: "4rem",
            opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.6s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: "1.1rem" }}>
              <span style={{ width: 22, height: 2, background: "#1429D0", borderRadius: 2, display: "inline-block" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1429D0", letterSpacing: "2.5px", textTransform: "uppercase" }}>Your Journey</span>
              <span style={{ width: 22, height: 2, background: "#1429D0", borderRadius: 2, display: "inline-block" }} />
            </div>
            <h2 style={{
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900,
              color: "#161619", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "0.8rem",
            }}>
              From Enrolled to{" "}
              <span style={{
                background: "linear-gradient(135deg, #1429D0, #0E7FDD)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Employed
              </span>
            </h2>
            <p style={{ color: "#36383e", fontSize: "1rem", lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>
              A detailed map of every milestone, so you always know where you are and what's next.
            </p>
          </div>

          {/* ── Timeline ── */}
          <div style={{ position: "relative" }}>

            {/* Vertical line */}
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0, width: 2,
              background: "rgba(20,41,208,0.10)",
              transform: "translateX(-50%)", borderRadius: 2, overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, borderRadius: 2,
                background: "linear-gradient(to bottom, #1429D0, #0E7FDD)",
                height: inView ? "100%" : "0%",
                transition: "height 2.5s ease",
              }} />
            </div>

            {course.journey.map((step, i) => {
              const isLeft = i % 2 === 0;
              const isHov  = hovStep === i;

              return (
                <div
                  key={i}
                  className="dp-journey-row"
                  style={{
                    display: "flex",
                    justifyContent: isLeft ? "flex-start" : "flex-end",
                    marginBottom: i < course.journey.length - 1 ? "3rem" : 0,
                    position: "relative",
                    opacity: inView ? 1 : 0,
                    transform: inView ? "none" : `translateX(${isLeft ? -30 : 30}px)`,
                    transition: `all 0.6s ${i * 0.1}s ease`,
                  }}
                >
                  {/* Card */}
                  <div
                    className="dp-journey-card"
                    onMouseEnter={() => setHovStep(i)}
                    onMouseLeave={() => setHovStep(null)}
                    style={{
                      width: "calc(50% - 3rem)",
                      background: isHov ? "#fff" : "#fff",
                      borderRadius: 20, padding: "1.5rem 1.8rem",
                      border: `1.5px solid ${isHov ? "#1429D0" : "rgba(20,41,208,0.10)"}`,
                      boxShadow: isHov
                        ? "0 16px 40px rgba(20,41,208,0.12)"
                        : "0 2px 12px rgba(20,41,208,0.05)",
                      transition: "all 0.3s ease",
                      transform: isHov
                        ? (isLeft ? "translateX(-6px)" : "translateX(6px)")
                        : "none",
                      cursor: "default",
                      textAlign: isLeft ? "right" : "left",
                    }}
                  >
                    {/* Phase badge */}
                    <div style={{
                      display: "inline-block", padding: "0.2rem 0.75rem", borderRadius: 100,
                      background: isHov ? "#1429D0" : "#F2F5FF",
                      color: isHov ? "#fff" : "#1429D0",
                      fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.6rem",
                      border: "1px solid rgba(20,41,208,0.15)",
                      transition: "all 0.25s ease",
                    }}>
                      {step.phase}
                    </div>

                    <h3 style={{
                      fontWeight: 800, fontSize: "1.05rem",
                      color: "#161619", marginBottom: "0.4rem", lineHeight: 1.3,
                    }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "#36383e", lineHeight: 1.65 }}>{step.desc}</p>
                  </div>

                  {/* Center node */}
                  <div
                    className="dp-journey-node"
                    style={{
                      position: "absolute", left: "50%", top: "50%",
                      transform: "translate(-50%, -50%)",
                      width: isHov ? 54 : 46, height: isHov ? 54 : 46,
                      borderRadius: "50%",
                      background: isHov
                        ? "linear-gradient(135deg, #1429D0, #0E7FDD)"
                        : "#fff",
                      border: `2.5px solid ${isHov ? "transparent" : "#1429D0"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: isHov
                        ? "0 6px 20px rgba(20,41,208,0.35)"
                        : "0 4px 12px rgba(20,41,208,0.12)",
                      transition: "all 0.3s ease", zIndex: 2,
                    }}
                  >
                    <StepIcon
                      iconKey={step.icon}
                      color={isHov ? "#fff" : "#1429D0"}
                      index={i}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Bottom CTA ── */}
          <div style={{
            textAlign: "center", marginTop: "4.5rem", padding: "2.5rem 2rem",
            background: "#fff",
            borderRadius: 24,
            border: "1.5px solid rgba(20,41,208,0.12)",
            boxShadow: "0 8px 40px rgba(20,41,208,0.07)",
            opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.6s 0.7s ease",
          }}>
            {/* Accent top stripe */}
            <div style={{
              width: 48, height: 4, borderRadius: 2,
              background: "linear-gradient(90deg, #1429D0, #0E7FDD)",
              margin: "0 auto 1.4rem",
            }} />

            <div style={{
              fontSize: "1.45rem", fontWeight: 900,
              color: "#161619", marginBottom: "0.5rem", letterSpacing: "-0.02em",
            }}>
              Ready to start your journey?
            </div>
            <p style={{ color: "#36383e", fontSize: "0.9rem", marginBottom: "1.8rem", lineHeight: 1.6 }}>
              Join the next cohort — only <strong style={{ color: "#1429D0" }}>25 seats</strong> available.
            </p>
            <button
              className="dp-journey-cta-btn"
              style={{
                padding: "0.95rem 2.5rem", borderRadius: 12, border: "none",
                background: "#1429D0", color: "#fff",
                fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(20,41,208,0.28)",
                transition: "all 0.25s ease",
              }}
              onClick={() => setModalOpen(true)}
            >
              Enroll Now — {course.price}
            </button>
          </div>

        </div>
      </section>
    </>
  );
}