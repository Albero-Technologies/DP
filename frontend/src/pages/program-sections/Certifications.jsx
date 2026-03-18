import { useState, useEffect, useRef } from "react";
import { useInView } from "../../hooks/useInView";
import EnrollModal from "../../components/EnrollModel";

// ── SVG Icon library ──────────────────────────────────────────────────────
const CERT_ICONS = {
  "🏆": ({ color }) => (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
      <path d="M8 21h8M12 17v4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M5 3H3v6c0 3.3 4 6 9 6s9-2.7 9-6V3h-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 3h14" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  "📊": ({ color }) => (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
      <rect x="3"  y="13" width="4" height="8" rx="1" fill={color} opacity=".5"/>
      <rect x="10" y="9"  width="4" height="12" rx="1" fill={color} opacity=".75"/>
      <rect x="17" y="5"  width="4" height="16" rx="1" fill={color}/>
      <line x1="2" y1="22" x2="22" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "💼": ({ color }) => (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="8" width="20" height="13" rx="2" stroke={color} strokeWidth="1.8"/>
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={color} strokeWidth="1.8"/>
      <line x1="2" y1="14" x2="22" y2="14" stroke={color} strokeWidth="1.8"/>
    </svg>
  ),
  "📈": ({ color }) => (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
      <polyline points="4,18 9,12 13,15 20,7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="15,7 20,7 20,12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "🎓": ({ color }) => (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
      <polygon points="12,3 22,9 12,15 2,9" fill={color} opacity=".18" stroke={color} strokeWidth="1.8"/>
      <path d="M7 11.5v4.5c0 0 2 2 5 2s5-2 5-2v-4.5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="22" y1="9" x2="22" y2="14" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  "💡": ({ color }) => (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
      <path d="M9 21h6M12 3a7 7 0 0 1 4 12.74V17H8v-1.26A7 7 0 0 1 12 3z" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  "🔬": ({ color }) => (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
      <path d="M9 3h6v10l3 4H6l3-4V3z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="9" y1="8" x2="15" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="4" y1="21" x2="20" y2="21" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  "🚀": ({ color }) => (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8 6 7 10 7 13l2 2c3 0 7-1 11-5 0-5-3-8-8-8z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M7 13l-3 5 5-3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="14" cy="10" r="1.5" fill={color}/>
    </svg>
  ),
};

const CertIconSvg = ({ iconKey, color }) => {
  const Comp = CERT_ICONS[iconKey];
  if (Comp) return <Comp color={color} />;
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
};

// ── 3D tilt card ──────────────────────────────────────────────────────────
function CertCard({ cert, index, inView }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRotateY(((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) * 10);
    setRotateX(-(((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * 10));
  };
  const handleMouseLeave = () => { setRotateX(0); setRotateY(0); };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(30px)",
        transition: `opacity .6s ${index * .15}s ease, transform .6s ${index * .15}s ease`,
        width: "100%",
      }}
    >
      <div style={{
        width: "100%",
        transformStyle: "preserve-3d",
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform .35s cubic-bezier(.4,0,.2,1)",
      }}>
        <div style={{
          background: cert.bg,
          borderRadius: 20, padding: "2rem 2.2rem",
          border: `1.5px solid ${cert.color}30`,
          boxShadow: `0 16px 48px rgba(0,0,0,.08), 0 0 0 1px ${cert.color}15`,
          display: "flex", flexDirection: "column", gap: "1rem",
          overflow: "hidden", position: "relative",
          aspectRatio: "4 / 3", justifyContent: "space-between",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -24, right: -24, width: 96, height: 96, borderRadius: "50%", background: `${cert.color}18`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -16, left: -16, width: 64, height: 64, borderRadius: "50%", background: `${cert.color}10`, pointerEvents: "none" }} />

          {/* Top row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              {cert.badge && (
                <div style={{ display: "inline-block", padding: ".18rem .65rem", borderRadius: 100, background: "#FCD34D", color: "#92400E", fontSize: "0.65rem", fontWeight: 700, marginBottom: ".5rem" }}>
                  {cert.badge}
                </div>
              )}
              <div style={{ fontWeight: 900, fontSize: "1.15rem", color: cert.textColor, lineHeight: 1.3, letterSpacing: "-0.02em" }}>{cert.name}</div>
              <div style={{ fontSize: "0.74rem", color: cert.textColor === "#fff" ? "rgba(255,255,255,.55)" : "#94A3B8", fontWeight: 500, marginTop: ".25rem" }}>
                Issued by {cert.issuer}
              </div>
            </div>
            <div style={{ flexShrink: 0, marginLeft: "1rem", marginTop: ".1rem" }}>
              <CertIconSvg iconKey={cert.icon} color={cert.color} />
            </div>
          </div>

          {/* Description */}
          {cert.desc && (
            <p style={{ fontSize: "0.88rem", color: cert.textColor === "#fff" ? "rgba(255,255,255,.65)" : "#64748B", lineHeight: 1.7, position: "relative", zIndex: 1, margin: 0 }}>
              {cert.desc}
            </p>
          )}

          {/* Dots row */}
          <div style={{ display: "flex", gap: ".35rem", position: "relative", zIndex: 1 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: cert.color, opacity: .5 + i * .12 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function Certifications({ course }) {
  const [ref, inView]       = useInView(0.1);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);
  const total = course.certifications.length;
  // Enroll modal state
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 3500);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, total]);

  const goTo = (i) => { setCurrent(i); setIsPlaying(false); };
  const prev  = () => { setCurrent(c => (c - 1 + total) % total); setIsPlaying(false); };
  const next  = () => { setCurrent(c => (c + 1) % total); setIsPlaying(false); };

  return (
    <>
        {/* Enroll modal outside the main section to avoid z-index and overflow issues */}
      <EnrollModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        .dp-cert-arrow { transition: all .2s ease !important; }
        .dp-cert-arrow:hover { background: #1429D0 !important; border-color: #1429D0 !important; }
        .dp-cert-arrow:hover svg path { stroke: #fff !important; }
        .dp-cert-play:hover  { background: #1429D0 !important; }
        .dp-cert-play:hover svg rect,
        .dp-cert-play:hover svg path { fill: #fff !important; }
        .dp-cert-enroll:hover { transform: translateY(-2px) scale(1.02) !important; background: #1E3A8A !important; box-shadow: 0 8px 28px rgba(20,41,208,0.36) !important; }
      `}</style>

      <section ref={ref} style={{
        padding: "90px 5%",
        background: "#ffffff",
        borderTop: "1px solid rgba(20,41,208,0.08)",
        borderBottom: "1px solid rgba(20,41,208,0.08)",
        overflow: "hidden", position: "relative",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Blobs */}
        <div style={{ position: "absolute", top: -60, right: -40, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,41,208,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,127,221,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Header */}
          <div style={{
            textAlign: "center", marginBottom: "3.5rem",
            opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all .6s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: "1.1rem" }}>
              <span style={{ width: 22, height: 2, background: "#1429D0", borderRadius: 2, display: "inline-block" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1429D0", letterSpacing: "2.5px", textTransform: "uppercase" }}>Certifications</span>
              <span style={{ width: 22, height: 2, background: "#1429D0", borderRadius: 2, display: "inline-block" }} />
            </div>
            <h2 style={{
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900,
              color: "#161619", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: ".8rem",
            }}>
              Credentials That{" "}
              <span style={{
                background: "linear-gradient(135deg, #1429D0, #0E7FDD)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Open Doors
              </span>
            </h2>
            <p style={{ color: "#36383e", fontSize: "1rem", lineHeight: 1.75, maxWidth: 500, margin: "0 auto" }}>
              Graduate with certificates that recruiters at top companies actively search for.
            </p>
          </div>

          {/* Slider */}
          <div style={{
            position: "relative",
            opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all .6s .2s ease",
          }}>
            <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
              <div style={{ overflow: "hidden", borderRadius: 24, padding: "1rem 0" }}>
                <div style={{
                  display: "flex",
                  transition: "transform .55s cubic-bezier(.4,0,.2,1)",
                  transform: `translateX(calc(-${current * 100}%))`,
                }}>
                  {course.certifications.map((cert, i) => (
                    <div key={i} style={{
                      minWidth: "100%", boxSizing: "border-box", padding: "0 .5rem",
                      transform: current === i ? "scale(1)" : "scale(0.94)",
                      opacity: current === i ? 1 : 0.4,
                      transition: "transform .55s ease, opacity .55s ease",
                    }}>
                      <CertCard cert={cert} index={i} inView={inView} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow buttons */}
              {[
                { side: "left",  handler: prev, d: "M15 18l-6-6 6-6" },
                { side: "right", handler: next, d: "M9 6l6 6-6 6"   },
              ].map(({ side, handler, d }) => (
                <button
                  key={side}
                  className="dp-cert-arrow"
                  onClick={handler}
                  style={{
                    position: "absolute",
                    [side]: -28, top: "50%",
                    transform: "translateY(-50%)",
                    width: 44, height: 44, borderRadius: "50%",
                    background: "#fff",
                    border: "1.5px solid rgba(20,41,208,0.18)",
                    boxShadow: "0 4px 16px rgba(20,41,208,0.10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", zIndex: 10,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d={d} stroke="#1429D0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
            </div>

            {/* Dots + controls row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "1.6rem" }}>

              {/* Prev ghost */}
              <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.3rem", display: "flex", alignItems: "center", opacity: 0.4, transition: "opacity .2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.4}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="#1429D0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Pill dots */}
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                {course.certifications.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)} style={{
                    width: i === current ? 26 : 7, height: 7, borderRadius: 4, border: "none",
                    background: i === current ? "#1429D0" : "rgba(20,41,208,0.14)",
                    cursor: "pointer", transition: "all .35s ease", padding: 0,
                    boxShadow: i === current ? "0 2px 8px rgba(20,41,208,0.30)" : "none",
                  }} />
                ))}
              </div>

              {/* Next ghost */}
              <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.3rem", display: "flex", alignItems: "center", opacity: 0.4, transition: "opacity .2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.4}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="#1429D0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Counter */}
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.5px", minWidth: 36, textAlign: "center" }}>
                {current + 1} / {total}
              </div>

              {/* Play / pause */}
              <button
                className="dp-cert-play"
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  border: "1.5px solid rgba(20,41,208,0.22)",
                  background: "rgba(20,41,208,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all .2s",
                }}
              >
                {isPlaying
                  ? <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><rect x="2" y="1" width="4" height="12" rx="1.5" fill="#1429D0"/><rect x="8" y="1" width="4" height="12" rx="1.5" fill="#1429D0"/></svg>
                  : <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 1.5l10 5.5-10 5.5V1.5z" fill="#1429D0"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Info strip */}
          <div style={{
            marginTop: "2.5rem", padding: "1.5rem 2rem",
            background: "#F5F7FA", borderRadius: 16,
            border: "1.5px solid rgba(20,41,208,0.10)",
            display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap",
            opacity: inView ? 1 : 0, transition: "opacity .6s .5s ease",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "#F2F5FF", border: "1px solid rgba(20,41,208,0.14)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M8 21h8M12 17v4" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M5 3H3v6c0 3.3 4 6 9 6s9-2.7 9-6V3h-2" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 3h14" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#161619" }}>All certificates are immediately shareable on LinkedIn</div>
              <div style={{ fontSize: "0.82rem", color: "#36383e", marginTop: ".2rem" }}>Add them to your profile with one click. Verified credentials with unique certificate IDs.</div>
            </div>
            <button
              className="dp-cert-enroll"
              style={{
                marginLeft: "auto", padding: ".65rem 1.4rem", borderRadius: 8, border: "none",
                background: "#1429D0", color: "#fff",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.87rem", fontWeight: 700,
                cursor: "pointer", flexShrink: 0,
                boxShadow: "0 4px 14px rgba(20,41,208,0.25)",
                transition: "all .2s ease",
              }}
              onClick={() => setModalOpen(true)}
            >
              Enroll to Earn Them →
            </button>
          </div>

        </div>
      </section>
    </>
  );
}