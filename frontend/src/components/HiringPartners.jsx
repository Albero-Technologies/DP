import { useState } from "react";
import { useInView } from "../hooks/useInView";
import { HIRING_ROWS } from "../data/companies";

// ── Real brand icons as SVG ──────────────────────────────────────────────────
const BrandIcon = ({ name, size = 36 }) => {
  const s = size * 0.55;

  const icons = {
    Google: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    Amazon: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <path fill="#FF9900" d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.076-1.052-.872-1.238-1.276-1.814-2.106-1.734 1.768-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095v-.41c0-.753.06-1.642-.384-2.294-.385-.584-1.124-.825-1.775-.825-1.205 0-2.277.618-2.54 1.897-.054.285-.261.566-.549.58l-3.075-.333c-.259-.056-.548-.266-.472-.66C5.97 2.445 8.855 1.5 11.44 1.5c1.318 0 3.038.351 4.076 1.348C16.62 3.95 16.5 5.757 16.5 7.716v4.948c0 1.487.617 2.142 1.198 2.946.203.285.249.627-.01.839l-2.544 2.346z"/>
        <path fill="#FF9900" d="M20.945 19.595c-1.876 1.532-4.598 2.348-6.943 2.348-3.286 0-6.241-1.215-8.479-3.237-.175-.158-.019-.374.192-.251 2.414 1.404 5.398 2.248 8.48 2.248 2.079 0 4.369-.431 6.475-1.325.318-.134.586.208.275.217z"/>
        <path fill="#FF9900" d="M21.705 18.714c-.24-.307-1.587-.146-2.192-.073-.184.021-.212-.137-.047-.253 1.073-.755 2.834-.537 3.038-.284.204.254-.054 2.018-1.062 2.859-.155.13-.302.061-.233-.11.227-.566.735-1.832.496-2.139z"/>
      </svg>
    ),
    Microsoft: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <path fill="#F25022" d="M1 1h10.5v10.5H1z"/>
        <path fill="#7FBA00" d="M12.5 1H23v10.5H12.5z"/>
        <path fill="#00A4EF" d="M1 12.5h10.5V23H1z"/>
        <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z"/>
      </svg>
    ),
    IBM: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <path fill="#1F70C1" d="M0 7h24v1.5H0zm0 3h24v1.5H0zm3 3h18v1.5H3zm3 3h12v1.5H6zm-3 3h18v1.5H3zM0 4h24v1.5H0z"/>
      </svg>
    ),
    Adobe: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <path fill="#FF0000" d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.885 1.376H.19L5.907 14.4zm6.229 0h8.697L9.1 14.4z"/>
      </svg>
    ),
    Accenture: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <path fill="#A100FF" d="M16.5 12L24 0H9l7.5 12zM7.5 24L0 12l7.5-12L15 12z"/>
      </svg>
    ),
    Deloitte: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <path fill="#86BC25" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path fill="#86BC25" d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
      </svg>
    ),
    PwC: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <text x="0" y="18" fontSize="14" fontWeight="900" fill="#D04A02" fontFamily="Arial">PwC</text>
      </svg>
    ),
    EY: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#FFE600"/>
        <text x="3" y="17" fontSize="13" fontWeight="900" fill="#2E2E38" fontFamily="Arial">EY</text>
      </svg>
    ),
    KPMG: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <text x="0" y="16" fontSize="10" fontWeight="900" fill="#00338D" fontFamily="Arial">KPMG</text>
      </svg>
    ),
    Wipro: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#341C6A"/>
        <text x="5" y="16" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Arial">WIPRO</text>
      </svg>
    ),
    Infosys: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#007CC3"/>
        <text x="2" y="16" fontSize="8" fontWeight="700" fill="#fff" fontFamily="Arial">INFOSYS</text>
      </svg>
    ),
    TCS: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#1C4DA1"/>
        <text x="4" y="16" fontSize="11" fontWeight="900" fill="#fff" fontFamily="Arial">TCS</text>
      </svg>
    ),
    Capgemini: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <path fill="#0070AD" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.93 0 3.68.72 5.01 1.9L4.9 17.01A6.97 6.97 0 0 1 5 12c0-3.87 3.13-7 7-7zm0 14c-1.93 0-3.68-.72-5.01-1.9L19.1 6.99A6.97 6.97 0 0 1 19 12c0 3.87-3.13 7-7 7z"/>
      </svg>
    ),
    Razorpay: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <path fill="#3395FF" d="M15.5 2L6 13h5.5L8 22l13-11h-6z"/>
      </svg>
    ),
    Flipkart: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#F74F00"/>
        <path fill="#fff" d="M7 6h3v5h3V6h3v12h-3v-5h-3v5H7z"/>
      </svg>
    ),
    Zomato: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#E23744"/>
        <text x="5" y="16" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Arial">ZOMA</text>
      </svg>
    ),
    Paytm: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#002970"/>
        <text x="2" y="16" fontSize="9" fontWeight="700" fill="#00BAF2" fontFamily="Arial">PAYTM</text>
      </svg>
    ),
    Swiggy: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#FC8019"/>
        <path fill="#fff" d="M12 6c-2.5 0-4.5 2-4.5 4.5 0 3 4.5 7.5 4.5 7.5s4.5-4.5 4.5-7.5C16.5 8 14.5 6 12 6zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
      </svg>
    ),
    JPMorgan: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#003087"/>
        <text x="2" y="15" fontSize="7.5" fontWeight="900" fill="#fff" fontFamily="Arial">JPMorgan</text>
      </svg>
    ),
    "Goldman Sachs": (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#1a1a2e"/>
        <text x="3" y="15" fontSize="7" fontWeight="700" fill="#fff" fontFamily="Arial">Goldman</text>
        <text x="5" y="22" fontSize="7" fontWeight="700" fill="#c9a84c" fontFamily="Arial">Sachs</text>
      </svg>
    ),
    "Tech Mahindra": (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#E31837"/>
        <text x="3" y="15" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="Arial">Tech M</text>
      </svg>
    ),
    Fractal: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#FF5722"/>
        <text x="5" y="16" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Arial">FRCL</text>
      </svg>
    ),
    "Sony Pictures": (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#111"/>
        <text x="3" y="14" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="Arial">SONY</text>
      </svg>
    ),
    "AT&T": (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#00A8E0"/>
        <text x="4" y="16" fontSize="9" fontWeight="900" fill="#fff" fontFamily="Arial">AT&T</text>
      </svg>
    ),
    AXA: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#00008F"/>
        <text x="4" y="16" fontSize="11" fontWeight="900" fill="#fff" fontFamily="Arial">AXA</text>
      </svg>
    ),
    "BNY Mellon": (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#009B77"/>
        <text x="3" y="15" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="Arial">BNY</text>
      </svg>
    ),
    Autodesk: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#0696D7"/>
        <path fill="#fff" d="M12 4L4 20h4l1.5-3.5h5L16 20h4L12 4zm0 5l1.8 4.5h-3.6L12 9z"/>
      </svg>
    ),
    "Booking.com": (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#003580"/>
        <text x="2" y="15" fontSize="7" fontWeight="700" fill="#fff" fontFamily="Arial">Booking</text>
      </svg>
    ),
    Sprinklr: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#0047AB"/>
        <text x="2" y="15" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="Arial">SPRNKLR</text>
      </svg>
    ),
    Genpact: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#9B1D6A"/>
        <text x="4" y="16" fontSize="8" fontWeight="700" fill="#fff" fontFamily="Arial">GEN</text>
      </svg>
    ),
    Turing: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#7C3AED"/>
        <text x="3" y="16" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Arial">TURING</text>
      </svg>
    ),
    "IDFC First Bank": (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#FF6B00"/>
        <text x="2" y="13" fontSize="7" fontWeight="700" fill="#fff" fontFamily="Arial">IDFC</text>
        <text x="3" y="21" fontSize="6" fontWeight="600" fill="#fff" fontFamily="Arial">FIRST</text>
      </svg>
    ),
    "Saint-Gobain": (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#E4002B"/>
        <text x="2" y="15" fontSize="7" fontWeight="700" fill="#fff" fontFamily="Arial">St-Gobain</text>
      </svg>
    ),
    SpringWorks: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#2563EB"/>
        <circle cx="12" cy="10" r="4" fill="none" stroke="#fff" strokeWidth="2"/>
        <path fill="#fff" d="M8 14c0 2.2 1.8 4 4 4s4-1.8 4-4"/>
      </svg>
    ),
    GlobalLogic: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#00539B"/>
        <text x="2" y="15" fontSize="7" fontWeight="700" fill="#fff" fontFamily="Arial">GlobalL</text>
      </svg>
    ),
    "Uptime AI": (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#10B981"/>
        <path fill="#fff" d="M12 5l-7 14h14L12 5zm0 4l4.5 9h-9L12 9z"/>
      </svg>
    ),
    "Bandhan Bank": (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#E31837"/>
        <text x="2" y="14" fontSize="7" fontWeight="700" fill="#fff" fontFamily="Arial">BANDHAN</text>
      </svg>
    ),
    EaseMyTrip: (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="3" fill="#FF6B00"/>
        <path fill="#fff" d="M5 13l4-8 3 5 2-3 5 6H5z"/>
      </svg>
    ),
  };

  const fallback = () => {
    const palette = ["#1429D0","#0E7FDD","#1E3A8A","#262832"];
    const bg = palette[name.charCodeAt(0) % palette.length];
    const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    return (
      <div style={{
        width: size * 0.7, height: size * 0.7,
        borderRadius: 6, background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: size * 0.22, color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}>{initials}</div>
    );
  };

  const icon = icons[name];
  return icon
    ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: size, height: size }}>{icon}</div>
    : fallback();
};

// ── Company card ─────────────────────────────────────────────────────────────
function CompanyCard({ company }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.85rem",
        background: hov ? "#fff" : "rgba(255,255,255,0.95)",
        border: `1.5px solid ${hov ? "rgba(20,41,208,0.4)" : "rgba(20,41,208,0.1)"}`,
        borderRadius: 16,
        padding: "0.75rem 1.2rem 0.75rem 0.75rem",
        marginRight: "0.85rem", flexShrink: 0,
        cursor: "pointer", transition: "all .22s ease",
        transform: hov ? "translateY(-4px) scale(1.01)" : "none",
        boxShadow: hov
          ? "0 16px 40px rgba(20,41,208,0.13), 0 2px 8px rgba(0,0,0,0.05)"
          : "0 1px 4px rgba(20,41,208,0.05), 0 0 0 0px rgba(20,41,208,0)",
        minWidth: 210,
      }}
    >
      {/* Logo box */}
      <div style={{
        width: 46, height: 46, borderRadius: 12,
        background: hov ? "rgba(20,41,208,0.04)" : "#F8FAFF",
        border: `1px solid ${hov ? "rgba(20,41,208,0.18)" : "rgba(20,41,208,0.08)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, overflow: "hidden",
        transition: "all .22s ease",
      }}>
        <BrandIcon name={company.name} size={44} />
      </div>

      {/* Text */}
      <div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
          fontSize: "0.875rem", color: "#161619",
          lineHeight: 1.25, whiteSpace: "nowrap",
        }}>{company.name}</div>
        <div style={{
          fontSize: "0.71rem",
          color: hov ? "#1429D0" : "#6B7280",
          marginTop: "0.2rem", whiteSpace: "nowrap", fontWeight: 500,
          transition: "color .22s ease",
        }}>{company.role}</div>
      </div>
    </div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ value, label }) {
  return (
    <div style={{
      display: "inline-flex", flexDirection: "column", alignItems: "center",
      padding: "0.9rem 2rem",
      background: "rgba(20,41,208,0.04)",
      border: "1px solid rgba(20,41,208,0.12)",
      borderRadius: 14,
    }}>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "1.6rem", fontWeight: 900, color: "#1429D0",
        lineHeight: 1, letterSpacing: "-0.03em",
      }}>{value}</span>
      <span style={{
        fontSize: "0.75rem", color: "#6B7280", fontWeight: 500,
        marginTop: "0.25rem", whiteSpace: "nowrap",
      }}>{label}</span>
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
export default function HiringPartners() {
  const [ref, inView] = useInView(0.08);
  const [paused, setPaused] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        .hp-section {
          background: #ffffff;
          padding: 4.5rem 0 4.5rem;
          overflow: hidden;
          position: relative;
          border-top: 1px solid rgba(20,41,208,0.08);
          border-bottom: 1px solid rgba(20,41,208,0.08);
          font-family: 'DM Sans', sans-serif;
        }

        /* Background mesh */
        .hp-bg-mesh {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 40% at 15% 20%, rgba(20,41,208,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 35% at 85% 80%, rgba(14,127,221,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 30% 50% at 50% 50%, rgba(20,41,208,0.025) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Dot grid pattern */
        .hp-dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(20,41,208,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%);
          pointer-events: none;
        }

        /* Edge fades */
        .hp-fade-left {
          position: absolute; top: 0; bottom: 0; left: 0; width: 200px;
          background: linear-gradient(90deg, rgba(255,255,255,1) 40%, transparent);
          pointer-events: none; z-index: 3;
        }
        .hp-fade-right {
          position: absolute; top: 0; bottom: 0; right: 0; width: 200px;
          background: linear-gradient(270deg, rgba(255,255,255,1) 40%, transparent);
          pointer-events: none; z-index: 3;
        }

        /* Header */
        .hp-header {
          text-align: center;
          margin-bottom: 4rem;
          position: relative; z-index: 4;
          padding: 0 5%;
        }

        .hp-label-row {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-bottom: 1.1rem;
        }
        .hp-label-line {
          width: 28px; height: 2px;
          background: linear-gradient(90deg, transparent, #1429D0);
          border-radius: 2px;
        }
        .hp-label-line.right {
          background: linear-gradient(90deg, #1429D0, transparent);
        }
        .hp-label {
          color: #1429D0; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
        }

        .hp-heading {
          font-size: clamp(2rem, 4vw, 2.9rem);
          font-weight: 900; color: #161619;
          letter-spacing: -0.035em; line-height: 1.1;
          margin-bottom: 1rem;
        }
        .hp-heading span {
          background: linear-gradient(135deg, #1429D0 0%, #0E7FDD 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hp-subtext {
          font-size: 1rem; color: "#6B7280";
          line-height: 1.7; max-width: 480px; margin: 0 auto 0;
          color: #6B7280;
        }

        /* Carousel */
        .hp-carousel-wrap {
          position: relative; z-index: 4;
        }
        .hp-row {
          overflow: hidden;
          margin-bottom: 0.9rem;
          /* Give vertical breathing room so hover shadows aren't clipped */
          padding: 10px 0;
          margin-top: -10px;
          margin-bottom: calc(0.9rem - 10px);
        }
        .hp-row:last-child { margin-bottom: -10px; }

        @keyframes marqueeLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .hp-track {
          display: flex; width: max-content; padding-left: 0.85rem;
        }

        /* Stat strip */
        .hp-stat-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 2.5rem;
          padding: 0 5%;
          position: relative; z-index: 4;
          flex-wrap: wrap;
        }

        .hp-stat-divider {
          width: 1px; height: 36px;
          background: rgba(20,41,208,0.15);
        }

        @media (max-width: 600px) {
          .hp-stat-divider { display: none; }
        }
      `}</style>

      <section id="hiring-partners" ref={ref} className="hp-section">
        <div className="hp-bg-mesh" />
        <div className="hp-dot-grid" />
        <div className="hp-fade-left" />
        <div className="hp-fade-right" />

        {/* Header */}
        <div
          className="hp-header"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "opacity .6s, transform .6s",
          }}
        >
          <div className="hp-label-row">
            <span className="hp-label-line" />
            <span className="hp-label">Our Hiring Partners</span>
            <span className="hp-label-line right" />
          </div>

          <h2 className="hp-heading">
            Our Graduates Work at{" "}
            <span>Dream Companies</span>
          </h2>

          <p className="hp-subtext">
            180+ companies actively hiring DataPreneur graduates across data, AI, cloud and finance roles.
          </p>
        </div>

        {/* Carousel rows */}
        <div
          className="hp-carousel-wrap"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {HIRING_ROWS.map((row, rowIdx) => {
            const doubled = [...row, ...row];
            const goRight = rowIdx % 2 === 1;
            const dur = 30 + rowIdx * 7;
            return (
              <div
                key={rowIdx}
                className="hp-row"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(28px)",
                  transition: `opacity .5s ${rowIdx * 0.1}s, transform .5s ${rowIdx * 0.1}s`,
                }}
              >
                <div
                  className="hp-track"
                  style={{
                    animation: `${goRight ? "marqueeRight" : "marqueeLeft"} ${dur}s linear infinite`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                >
                  {doubled.map((company, i) => (
                    <CompanyCard key={`${rowIdx}-${i}`} company={company} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stat strip — pills instead of plain text */}
        {/* <div
          className="hp-stat-strip"
          style={{ opacity: inView ? 1 : 0, transition: "opacity .6s .5s" }}
        >
          <StatPill value="180+" label="Hiring Partners" />
          <span className="hp-stat-divider" />
          <StatPill value="94%" label="Placement Rate" />
          <span className="hp-stat-divider" />
          <StatPill value="4+" label="Domains: AI · Data · Cloud · Finance" />
        </div> */}
         {/* Stat strip */}
        <div
          className="hp-stat-strip"
          style={{ opacity: inView ? 1 : 0, transition: "opacity .6s .5s" }}
        >
          <strong>180+</strong> hiring partners &nbsp;·&nbsp;
          <strong>94%</strong> placement rate &nbsp;·&nbsp;
          New partners added every quarter across <b style={{ color: "#161619" }}>AI, data, cloud & finance</b>
        </div>
      </section>
    </>
  );
}