"use client";
import EnrollModal from "./EnrollModel";
import { useEffect, useRef, useState } from "react";


/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─── Animated Counter ─── */
function useCounter(target, duration = 2200, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

/* ─── Section Label ─── */
const SectionLabel = ({ children }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "#F2F5FF", border: "1.5px solid #BFD2FF",
    borderRadius: 999, padding: "5px 16px",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    color: "#1429D0", fontWeight: 500, marginBottom: 16,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1429D0", display: "inline-block" }} />
    {children}
  </div>
);

/* ════════════════════
   REALISTIC SVG ICONS
════════════════════ */

/* Hero floating badges */
const IconTrophy = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M7 4H4a1 1 0 0 0-1 1v2a4 4 0 0 0 4 4M17 4h3a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M7 4h10v6a5 5 0 0 1-10 0V4Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.8"/>
    <path d="M12 15v3M9 21h6" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconGradCap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L2 8l10 5 10-5-10-5Z" fill="#BFD2FF" stroke="#1429D0" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M6 10.5v5a6 6 0 0 0 12 0v-5" stroke="#1429D0" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="22" y1="8" x2="22" y2="13" stroke="#1429D0" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IconStarFill = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#F59E0B">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>
  </svg>
);

/* Checklist checkmark */
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* Mission section mini-cards */
const IconTarget = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#1429D0" strokeWidth="1.6"/>
    <circle cx="12" cy="12" r="5" stroke="#0E7FDD" strokeWidth="1.4"/>
    <circle cx="12" cy="12" r="2" fill="#1429D0"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 8V3M21 8h-5" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 16v5M3 16h5" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* Value card icons — keyed by title, accept hov to swap to white on blue bg */
const ValueIcons = {
  "Outcome First": ({ hov }) => {
    const c = hov ? "#fff" : "#1429D0";
    const c2 = hov ? "rgba(255,255,255,0.6)" : "#0E7FDD";
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={c}  strokeWidth="1.6"/>
        <circle cx="12" cy="12" r="6"  stroke={c2} strokeWidth="1.4"/>
        <circle cx="12" cy="12" r="2.5" fill={c}/>
      </svg>
    );
  },
  "Real-World Depth": ({ hov }) => {
    const c = hov ? "#fff" : "#1429D0";
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    );
  },
  "Community Always": ({ hov }) => {
    const c = hov ? "#fff" : "#1429D0";
    const c2 = hov ? "rgba(255,255,255,0.7)" : "#0E7FDD";
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="3" stroke={c} strokeWidth="1.6"/>
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="17" cy="9" r="2.5" stroke={c2} strokeWidth="1.4"/>
        <path d="M21 20c0-2.8-1.8-5-4-5.5" stroke={c2} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    );
  },
  "Always Current": ({ hov }) => {
    const c = hov ? "#fff" : "#1429D0";
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.6"/>
        <polyline points="12,7 12,12 15,15" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
  },
  "Inclusive Access": ({ hov }) => {
    const c = hov ? "#fff" : "#1429D0";
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.6"/>
        <path d="M12 6v12M9 9h4.5a1.5 1.5 0 0 1 0 3H9m0 0h5a1.5 1.5 0 0 1 0 3H9" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    );
  },
  "Proven Results": ({ hov }) => {
    const c  = hov ? "#fff" : "#1429D0";
    const bg = hov ? "rgba(255,255,255,0.25)" : "#BFD2FF";
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3"  y="12" width="4" height="8"  rx="1" fill={bg} stroke={c} strokeWidth="1.3"/>
        <rect x="10" y="8"  width="4" height="12" rx="1" fill={bg} stroke={c} strokeWidth="1.3"/>
        <rect x="17" y="4"  width="4" height="16" rx="1" fill={bg} stroke={c} strokeWidth="1.3"/>
        <path d="M4 12 10 8 14 10 20 4" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  },
};

/* Timeline icons — rendered white inside blue circle */
const TimelineIcons = {
  rocket: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 7 8 7 14a5 5 0 0 0 10 0c0-6-5-12-5-12Z" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="1.6"/>
      <circle cx="12" cy="14" r="1.8" fill="#fff"/>
      <path d="M8 18l-2 3M16 18l2 3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  laptop: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="13" rx="2" stroke="#fff" strokeWidth="1.6"/>
      <path d="M1 21h22" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  celebrate: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 11l19-9-9 19-2-8-8-2Z" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  robot: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="8" width="16" height="12" rx="2" stroke="#fff" strokeWidth="1.6"/>
      <circle cx="9"  cy="14" r="1.5" fill="#fff"/>
      <circle cx="15" cy="14" r="1.5" fill="#fff"/>
      <path d="M9 18h6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M12 8V5M10 5h4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  trophy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 3h12v7a6 6 0 0 1-12 0V3Z" stroke="#fff" strokeWidth="1.6"/>
      <path d="M6 6H3a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4M18 6h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M12 16v3M9 19h6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
};

/* CTA section icons — rendered white */
const IconGradCapWhite = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L2 8l10 5 10-5-10-5Z" fill="rgba(255,255,255,0.3)" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M6 10.5v5a6 6 0 0 0 12 0v-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="22" y1="8" x2="22" y2="13" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IconBriefcase = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="8" width="20" height="13" rx="2" stroke="#fff" strokeWidth="1.6"/>
    <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="2" y1="14" x2="22" y2="14" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const IconCreditCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="1" y="4" width="22" height="16" rx="2" stroke="#fff" strokeWidth="1.6"/>
    <line x1="1" y1="10" x2="23" y2="10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="5"  y1="16" x2="9"  y2="16" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="13" y1="16" x2="17" y2="16" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

/* ════════════════════
   COMPANY LOGOS (SVG)
════════════════════ */
const CompanyLogos = {
  Google: () => (
    <svg width="64" height="22" viewBox="0 0 64 22" fill="none">
      <text x="0" y="17" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="700">
        <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan>
        <tspan fill="#FBBC05">o</tspan><tspan fill="#4285F4">g</tspan>
        <tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
      </text>
    </svg>
  ),
  Microsoft: () => (
    <svg width="96" height="22" viewBox="0 0 96 22" fill="none">
      <rect x="0"  y="1"  width="9" height="9" fill="#F25022"/>
      <rect x="10" y="1"  width="9" height="9" fill="#7FBA00"/>
      <rect x="0"  y="11" width="9" height="9" fill="#00A4EF"/>
      <rect x="10" y="11" width="9" height="9" fill="#FFB900"/>
      <text x="24" y="16" fontFamily="'Segoe UI',Arial,sans-serif" fontSize="12" fontWeight="600" fill="#737373">Microsoft</text>
    </svg>
  ),
  Amazon: () => (
    <svg width="76" height="24" viewBox="0 0 76 24" fill="none">
      <text x="0" y="15" fontFamily="Arial,sans-serif" fontSize="16" fontWeight="800" fill="#232F3E">amazon</text>
      <path d="M5 20 Q20 25 35 20" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M33 18 L37 20 L34 23" fill="#FF9900"/>
    </svg>
  ),
  Flipkart: () => (
    <svg width="76" height="22" viewBox="0 0 76 22" fill="none">
      <rect x="0" y="2" width="18" height="18" rx="4" fill="#2874F0"/>
      <text x="3" y="16" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="800" fill="#FFE500">F</text>
      <text x="22" y="16" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#2874F0">Flipkart</text>
    </svg>
  ),
  Paytm: () => (
    <svg width="68" height="22" viewBox="0 0 68 22" fill="none">
      <rect x="0" y="2" width="18" height="18" rx="3" fill="#002970"/>
      <text x="3" y="15" fontFamily="Arial,sans-serif" fontSize="10" fontWeight="800" fill="#00BAF2">P</text>
      <text x="22" y="16" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#002970">Paytm</text>
    </svg>
  ),
  Razorpay: () => (
    <svg width="86" height="22" viewBox="0 0 86 22" fill="none">
      <path d="M4 16L10 4l4 8-4 4H4Z" fill="#3395FF"/>
      <path d="M10 4l8 12h-4L10 4Z" fill="#072654"/>
      <text x="22" y="16" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#072654">Razorpay</text>
    </svg>
  ),
  Zomato: () => (
    <svg width="74" height="22" viewBox="0 0 74 22" fill="none">
      <rect x="0" y="2" width="18" height="18" rx="9" fill="#E23744"/>
      <text x="5" y="16" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="800" fill="#fff">Z</text>
      <text x="22" y="16" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#E23744">Zomato</text>
    </svg>
  ),
  "HDFC Bank": () => (
    <svg width="94" height="22" viewBox="0 0 94 22" fill="none">
      <rect x="0" y="3" width="16" height="16" rx="2" fill="#004C8F"/>
      <text x="2" y="15" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="800" fill="#fff">H</text>
      <text x="20" y="15" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="700" fill="#004C8F">HDFC Bank</text>
    </svg>
  ),
  Accenture: () => (
    <svg width="96" height="22" viewBox="0 0 96 22" fill="none">
      <path d="M6 18L12 4l6 14" stroke="#A100FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M8.5 13h7" stroke="#A100FF" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="22" y="16" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="600" fill="#A100FF">Accenture</text>
    </svg>
  ),
  Deloitte: () => (
    <svg width="80" height="22" viewBox="0 0 80 22" fill="none">
      <text x="0" y="16" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="700" fill="#86BC25">Deloitte</text>
      <circle cx="74" cy="8" r="3" fill="#86BC25"/>
    </svg>
  ),
  TCS: () => (
    <svg width="44" height="22" viewBox="0 0 44 22" fill="none">
      <text x="0" y="16" fontFamily="Arial,sans-serif" fontSize="17" fontWeight="800" fill="#003399">TCS</text>
    </svg>
  ),
  Infosys: () => (
    <svg width="72" height="22" viewBox="0 0 72 22" fill="none">
      <text x="0" y="16" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="700" fill="#007CC2">Infosys</text>
    </svg>
  ),
  PhonePe: () => (
    <svg width="80" height="22" viewBox="0 0 80 22" fill="none">
      <rect x="0" y="2" width="18" height="18" rx="9" fill="#5F259F"/>
      <text x="5" y="16" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="800" fill="#fff">P</text>
      <text x="22" y="16" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#5F259F">PhonePe</text>
    </svg>
  ),
  Swiggy: () => (
    <svg width="70" height="22" viewBox="0 0 70 22" fill="none">
      <rect x="0" y="2" width="18" height="18" rx="9" fill="#FC8019"/>
      <text x="5" y="16" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="800" fill="#fff">S</text>
      <text x="22" y="16" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#FC8019">Swiggy</text>
    </svg>
  ),
  Meesho: () => (
    <svg width="74" height="22" viewBox="0 0 74 22" fill="none">
      <rect x="0" y="2" width="18" height="18" rx="4" fill="#F43397"/>
      <text x="4" y="16" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="800" fill="#fff">M</text>
      <text x="22" y="16" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#F43397">Meesho</text>
    </svg>
  ),
};

/* ─── Stat Card ─── */
function StatCard({ value, suffix, label, sub, delay, active }) {
  const count = useCounter(value, 2000, active);
  return (
    <div style={{
      background: "#fff", border: "1.5px solid #E8EEFF", borderRadius: 20,
      padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6,
      boxShadow: "0 2px 20px rgba(20,41,208,0.06)",
      opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(24px)",
      transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 48, fontWeight: 700, lineHeight: 1, color: "#1429D0" }}>
        {count}{suffix}
      </div>
      <div style={{ fontFamily: "'Clash Grotesk', sans-serif", color: "#262832", fontSize: 16, fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280", fontSize: 13 }}>{sub}</div>}
    </div>
  );
}

/* ─── Value Card ─── */
function ValueCard({ title, desc, delay, inView }) {
  const [hov, setHov] = useState(false);
  const Icon = ValueIcons[title];
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: "#fff", border: `1.5px solid ${hov ? "#1429D0" : "#E8EEFF"}`, borderRadius: 20,
      padding: "32px 28px", display: "flex", flexDirection: "column", gap: 14,
      boxShadow: hov ? "0 8px 40px rgba(20,41,208,0.12)" : "0 2px 16px rgba(20,41,208,0.05)",
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, border 0.2s, box-shadow 0.2s`,
      cursor: "default",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: hov ? "#1429D0" : "#F2F5FF",
        display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s",
      }}>
        {Icon && <Icon hov={hov} />}
      </div>
      <div style={{ fontFamily: "'Clash Grotesk', sans-serif", color: "#262832", fontSize: 18, fontWeight: 600 }}>{title}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280", fontSize: 14, lineHeight: 1.75 }}>{desc}</div>
    </div>
  );
}

/* ─── Team Card ─── */
function TeamCard({ name, role, initials, gradient, delay, inView }) {
  return (
    <div style={{
      background: "#fff", border: "1.5px solid #E8EEFF", borderRadius: 20,
      padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
      boxShadow: "0 2px 16px rgba(20,41,208,0.05)",
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: "50%", background: gradient,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Clash Display', sans-serif", fontSize: 28, fontWeight: 700, color: "#fff",
        boxShadow: "0 4px 20px rgba(20,41,208,0.2)",
      }}>{initials}</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Clash Grotesk', sans-serif", color: "#262832", fontWeight: 600, fontSize: 16 }}>{name}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#1429D0", fontSize: 13, marginTop: 4 }}>{role}</div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {["LinkedIn", "Twitter"].map(s => (
          <span key={s} style={{ background: "#F2F5FF", border: "1.5px solid #BFD2FF", borderRadius: 999, padding: "3px 12px", fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#1429D0", fontWeight: 500 }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Timeline Item ─── */
function TimelineItem({ year, title, desc, iconKey, isLast, delay, inView }) {
  const Icon = TimelineIcons[iconKey];
  return (
    <div style={{
      display: "flex", gap: 24,
      opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-30px)",
      transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "linear-gradient(135deg, #1429D0, #0E7FDD)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: "0 4px 16px rgba(20,41,208,0.25)",
        }}>
          {Icon && <Icon />}
        </div>
        {!isLast && <div style={{ width: 2, flex: 1, background: "linear-gradient(to bottom, #BFD2FF, transparent)", minHeight: 40, marginTop: 4 }} />}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : 36 }}>
        <div style={{ display: "inline-block", background: "#F2F5FF", border: "1.5px solid #BFD2FF", borderRadius: 999, padding: "2px 12px", fontFamily: "'Clash Display', sans-serif", fontSize: 13, color: "#1429D0", fontWeight: 700, marginBottom: 10 }}>{year}</div>
        <div style={{ fontFamily: "'Clash Grotesk', sans-serif", color: "#262832", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{title}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280", fontSize: 14, lineHeight: 1.75, maxWidth: 420 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export default function AboutPage() {
  /* ── Scroll to top when this page mounts ── */
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const [heroRef,     heroInView]     = useInView(0.1);
  const [statsRef,    statsInView]    = useInView(0.3);
  const [missionRef,  missionInView]  = useInView(0.15);
  const [valuesRef,   valuesInView]   = useInView(0.1);
  const [timelineRef, timelineInView] = useInView(0.1);
  const [teamRef,     teamInView]     = useInView(0.1);
  const [partnersRef, partnersInView] = useInView(0.3);
  const [ctaRef,      ctaInView]      = useInView(0.3);

  const companies = ["Google","Microsoft","Amazon","Flipkart","Paytm","Razorpay","Zomato","HDFC Bank","Accenture","Deloitte","TCS","Infosys","PhonePe","Swiggy","Meesho"];

  // ── Fix 2: Consistent modal state name ──
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <EnrollModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=clash-grotesk@400,500,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dp-gradient {
          background: linear-gradient(135deg, #1429D0 0%, #0E7FDD 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dp-dot-bg {
          background-image: radial-gradient(circle, rgba(20,41,208,0.10) 1.5px, transparent 1.5px);
          background-size: 28px 28px;
        }
        .dp-grid-bg {
          background-image:
            linear-gradient(rgba(20,41,208,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,41,208,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track { display: flex; animation: marquee 28s linear infinite; width: max-content; }

        .dp-btn-primary {
          background: linear-gradient(135deg, #1429D0, #0E7FDD);
          color: #fff; border: none; cursor: pointer;
          border-radius: 12px; padding: 14px 32px;
          font-family: 'Clash Grotesk', sans-serif; font-size: 15px; font-weight: 500;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(20,41,208,0.28); transition: all 0.22s ease;
        }
        .dp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(20,41,208,0.38); }
        .dp-btn-outline {
          background: #fff; color: #1429D0; border: 1.5px solid #1429D0; cursor: pointer;
          border-radius: 12px; padding: 13px 32px;
          font-family: 'Clash Grotesk', sans-serif; font-size: 15px; font-weight: 500;
          display: inline-flex; align-items: center; gap: 8px; transition: all 0.22s ease;
        }
        .dp-btn-outline:hover { background: #F2F5FF; transform: translateY(-2px); }

        /* ── Tablet (≤ 900px) ── */
        @media (max-width: 900px) {
          .two-col   { grid-template-columns: 1fr !important; gap: 48px !important; }
          .four-col  { grid-template-columns: repeat(2, 1fr) !important; }
          .three-col { grid-template-columns: repeat(2, 1fr) !important; }
          .dp-cta-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .dp-hero-badges { display: none !important; }
          .dp-section-pad { padding: 64px 0 !important; }
          .dp-container { padding: 0 28px !important; }
        }

        /* ── Large mobile (≤ 640px) ── */
        @media (max-width: 640px) {
          .two-col   { gap: 36px !important; }
          .four-col  { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .dp-section-pad  { padding: 52px 0 !important; }
          .dp-container    { padding: 0 18px !important; }
          .dp-cta-inner    { padding: 36px 24px !important; border-radius: 20px !important; }
          .dp-hero-section { padding-top: 72px !important; padding-bottom: 56px !important; }
          .dp-stats-section { padding: 48px 0 !important; }
          .dp-hero-btns    { flex-direction: column !important; }
          .dp-btn-primary, .dp-btn-outline { width: 100%; justify-content: center; }
          .dp-mini-stat-grid { grid-template-columns: 1fr 1fr !important; }
          .dp-mission-tags   { gap: 6px !important; }
          .dp-mission-cards  { grid-template-columns: 1fr !important; }
          .dp-timeline-col   { display: none !important; }
          .dp-timeline-full  { grid-template-columns: 1fr !important; gap: 36px !important; }
          .dp-chips          { gap: 8px !important; }
        }

        /* ── Small mobile (≤ 400px) ── */
        @media (max-width: 400px) {
          .dp-container { padding: 0 14px !important; }
          .dp-section-pad { padding: 40px 0 !important; }
          .four-col  { gap: 10px !important; }
          .dp-cta-inner { padding: 28px 16px !important; }
          .dp-stat-card-pad { padding: 22px 16px !important; }
          .dp-value-card-pad { padding: 22px 18px !important; }
        }
      `}</style>

      <main style={{ background: "#F5F7FA", fontFamily: "'DM Sans', sans-serif", paddingTop: 66 }}>

        {/* ══════ HERO ══════ */}
        <section ref={heroRef} className="dp-hero-section" style={{ background: "#fff", position: "relative", overflow: "hidden", paddingTop: 88, paddingBottom: 88 }}>
          <div className="dp-grid-bg" style={{ position: "absolute", inset: 0 }} />
          <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,41,208,0.07) 0%, transparent 70%)", top: -120, right: -80, pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,127,221,0.06) 0%, transparent 70%)", bottom: -60, left: 80, pointerEvents: "none" }} />

          <div className="dp-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}>
            <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

              {/* Left */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s" }}>
                  <SectionLabel>About DataPreneur</SectionLabel>
                </div>
                <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, lineHeight: 1.1, color: "#161619", opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(32px)", transition: "all 0.75s cubic-bezier(0.16,1,0.3,1) 0.15s" }}>
                  We Turn <span className="dp-gradient">Data</span><br />Into Dream Careers.
                </h1>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#6B7280", lineHeight: 1.75, maxWidth: 480, opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(24px)", transition: "all 0.75s cubic-bezier(0.16,1,0.3,1) 0.28s" }}>
                  DataPreneur is India's most trusted Data & AI career school — built by practitioners, for the next generation of data professionals ready to shape the future.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(20px)", transition: "all 0.75s cubic-bezier(0.16,1,0.3,1) 0.38s" }}>
                  {["Industry-aligned curriculum updated every quarter","1-on-1 mentorship from senior data professionals","Dedicated placement support with 200+ hiring partners"].map((t, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #1429D0, #0E7FDD)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <IconCheck />
                      </div>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", color: "#36383E", fontSize: 14 }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div className="dp-hero-btns" style={{ display: "flex", gap: 14, flexWrap: "wrap", opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(16px)", transition: "all 0.75s cubic-bezier(0.16,1,0.3,1) 0.48s" }}>
                  <button className="dp-btn-primary">Explore Courses →</button>
                  <button className="dp-btn-outline">Our Story</button>
                </div>
              </div>

              {/* Right */}
              <div style={{ position: "relative", opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(32px)", transition: "all 0.85s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>
                <div style={{ background: "linear-gradient(145deg, #1429D0 0%, #1E3A8A 100%)", borderRadius: 28, padding: "40px 36px", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(20,41,208,0.3)" }}>
                  <div className="dp-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: "6px 16px", display: "inline-flex", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 500, marginBottom: 24, border: "1px solid rgba(255,255,255,0.15)" }}>
                      🇮🇳 India's #1 Data Career School
                    </div>
                    <div style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", fontSize: 28, fontWeight: 700, lineHeight: 1.25, marginBottom: 12 }}>
                      "Democratizing data education for every Indian professional."
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 13 }}>— DataPreneur's founding mission, 2019</div>
                    <div className="dp-mini-stat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 32 }}>
                      {[{ v: "10K+", l: "Students" }, { v: "95%", l: "Placement" }, { v: "200+", l: "Partners" }].map((s, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "16px 12px", textAlign: "center" }}>
                          <div style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", fontSize: 22, fontWeight: 700 }}>{s.v}</div>
                          <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 4 }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Floating badges — hidden on mobile via className */}
                <div className="dp-hero-badges" style={{ position: "absolute", top: -20, right: -20, background: "#fff", border: "1.5px solid #E8EEFF", borderRadius: 16, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(20,41,208,0.12)", animation: "float-y 3s ease-in-out infinite" }}>
                  <IconTrophy />
                  <div>
                    <div style={{ fontFamily: "'Clash Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "#262832" }}>Top Rated</div>
                    <div style={{ display: "flex", gap: 2, marginTop: 2 }}>{[...Array(5)].map((_, i) => <IconStarFill key={i} />)}</div>
                  </div>
                </div>
                <div className="dp-hero-badges" style={{ position: "absolute", bottom: -20, left: -20, background: "#fff", border: "1.5px solid #E8EEFF", borderRadius: 16, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(20,41,208,0.12)", animation: "float-y 3.5s ease-in-out infinite 0.8s" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1429D0,#0E7FDD)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IconGradCap />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Clash Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "#262832" }}>Since 2019</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#6B7280" }}>5+ years of excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ STATS ══════ */}
        <section ref={statsRef} className="dp-stats-section" style={{ background: "#F5F7FA", padding: "64px 0" }}>
          <div className="dp-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
            <div className="four-col dp-stat-card-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              <StatCard value={10000} suffix="+" label="Students Trained"  sub="Across India & abroad"          delay={0}   active={statsInView} />
              <StatCard value={95}    suffix="%" label="Placement Rate"     sub="Within 90 days of completion"   delay={120} active={statsInView} />
              <StatCard value={50}    suffix="+" label="Expert Mentors"     sub="Active industry professionals"  delay={240} active={statsInView} />
              <StatCard value={200}   suffix="+" label="Hiring Partners"    sub="Top companies & startups"       delay={360} active={statsInView} />
            </div>
          </div>
        </section>

        {/* ══════ MISSION ══════ */}
        <section ref={missionRef} className="dp-section-pad" style={{ background: "#fff", padding: "90px 0", position: "relative", overflow: "hidden" }}>
          <div className="dp-dot-bg" style={{ position: "absolute", inset: 0 }} />
          <div className="dp-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}>
            <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
              {/* Left visual */}
              <div style={{ opacity: missionInView ? 1 : 0, transform: missionInView ? "translateX(0)" : "translateX(-40px)", transition: "all 0.85s cubic-bezier(0.16,1,0.3,1)", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#F2F5FF", border: "1.5px solid #BFD2FF", borderRadius: 24, padding: "32px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(20,41,208,0.07)" }} />
                  <div style={{ fontFamily: "'Clash Display', sans-serif", color: "#1429D0", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Our Approach</div>
                  <div style={{ fontFamily: "'Clash Display', sans-serif", color: "#262832", fontSize: 24, fontWeight: 700, lineHeight: 1.3, marginBottom: 20 }}>Real Skills. Real Projects. Real Results.</div>
                  <div className="dp-mission-tags" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["Python","SQL","Power BI","Machine Learning","Tableau","Statistics"].map(tag => (
                      <span key={tag} style={{ background: "#fff", border: "1.5px solid #BFD2FF", borderRadius: 999, padding: "4px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#1429D0", fontWeight: 500 }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="dp-mission-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { Icon: IconTarget,  title: "Outcome Driven", desc: "Every course is mapped to specific job roles and salary targets." },
                    { Icon: IconRefresh, title: "Always Updated",  desc: "Curriculum refreshed quarterly to match live industry needs." },
                  ].map((c, i) => (
                    <div key={i} style={{ background: "#fff", border: "1.5px solid #E8EEFF", borderRadius: 20, padding: "24px 20px", boxShadow: "0 2px 16px rgba(20,41,208,0.05)" }}>
                      <div style={{ marginBottom: 10 }}><c.Icon /></div>
                      <div style={{ fontFamily: "'Clash Grotesk', sans-serif", color: "#262832", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{c.title}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right copy */}
              <div style={{ opacity: missionInView ? 1 : 0, transform: missionInView ? "translateX(0)" : "translateX(40px)", transition: "all 0.85s cubic-bezier(0.16,1,0.3,1) 0.2s", display: "flex", flexDirection: "column", gap: 22 }}>
                <SectionLabel>Who We Are</SectionLabel>
                <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 700, color: "#161619", lineHeight: 1.15 }}>
                  Built by <span className="dp-gradient">Practitioners</span>,<br />For Practitioners.
                </h2>
                <div style={{ width: 64, height: 3, background: "linear-gradient(90deg, #1429D0, #0E7FDD)", borderRadius: 2 }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280", fontSize: 16, lineHeight: 1.8 }}>
                  Founded in 2019 with a singular purpose — to bridge the gap between traditional education and the real-world demands of the data industry. Our curriculum is designed and delivered by active data professionals who work in the field every single day.
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280", fontSize: 16, lineHeight: 1.8 }}>
                  We don't just teach tools. We build mindsets. Our students don't just get jobs — they build careers that compound with the exponentially evolving world of Data & AI.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Industry-aligned curriculum updated quarterly","1-on-1 mentorship from senior data professionals","Real project experience with live datasets","Dedicated placement support & career coaching"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #1429D0, #0E7FDD)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <IconCheck />
                      </div>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", color: "#36383E", fontSize: 14 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ VALUES ══════ */}
        <section ref={valuesRef} className="dp-section-pad" style={{ background: "#F5F7FA", padding: "90px 0" }}>
          <div className="dp-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 56, opacity: valuesInView ? 1 : 0, transform: valuesInView ? "translateY(0)" : "translateY(24px)", transition: "all 0.65s cubic-bezier(0.16,1,0.3,1)" }}>
              <SectionLabel>Our Values</SectionLabel>
              <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, color: "#161619", lineHeight: 1.15, marginTop: 4 }}>
                What Drives <span className="dp-gradient">Everything</span> We Do
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280", fontSize: 16, maxWidth: 500, margin: "16px auto 0", lineHeight: 1.7 }}>
                Six principles that guide every decision we make at DataPreneur.
              </p>
            </div>
            <div className="three-col dp-value-card-pad" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[
                { title: "Outcome First",    desc: "Every decision is anchored to one question: does this get our student closer to their dream career? If not, we don't build it.", delay: 0 },
                { title: "Real-World Depth", desc: "We go beyond surface-level tutorials. Our courses are rooted in real industry use-cases, giving students a competitive edge from day one.", delay: 100 },
                { title: "Community Always", desc: "Learning is better together. Our alumni network of 10,000+ professionals is an ongoing resource long after graduation.", delay: 200 },
                { title: "Always Current",   desc: "The data industry evolves at lightning speed. We refresh our curriculum every quarter to ensure you're learning what matters right now.", delay: 300 },
                { title: "Inclusive Access", desc: "Great talent doesn't come from privilege. We offer flexible pricing, scholarships, and EMI so no barrier blocks your growth.", delay: 400 },
                { title: "Proven Results",   desc: "Our 95% placement rate is a commitment we keep — tracked, verified, and celebrated with every single cohort.", delay: 500 },
              ].map((v, i) => <ValueCard key={i} {...v} inView={valuesInView} />)}
            </div>
          </div>
        </section>

        {/* ══════ TIMELINE ══════ */}
        <section ref={timelineRef} className="dp-section-pad" style={{ background: "#fff", padding: "90px 0", position: "relative", overflow: "hidden" }}>
          <div className="dp-dot-bg" style={{ position: "absolute", inset: 0 }} />
          <div style={{ position: "absolute", top: "50%", left: "55%", transform: "translate(-50%, -50%)", fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(80px,18vw,200px)", fontWeight: 700, color: "rgba(20,41,208,0.03)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", letterSpacing: -4 }}>JOURNEY</div>
          <div className="dp-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}>
            <div className="two-col dp-timeline-full" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
              <div className="dp-timeline-col" style={{ opacity: timelineInView ? 1 : 0, transform: timelineInView ? "translateX(0)" : "translateX(-40px)", transition: "all 0.85s cubic-bezier(0.16,1,0.3,1)" }}>
                <SectionLabel>Our Journey</SectionLabel>
                <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 700, color: "#161619", lineHeight: 1.15, marginTop: 8, marginBottom: 20 }}>
                  From an Idea to<br /><span className="dp-gradient">India's Best.</span>
                </h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280", fontSize: 16, lineHeight: 1.8, maxWidth: 400, marginBottom: 32 }}>
                  A five-year journey of relentless focus on transforming careers through world-class data education.
                </p>
                <div className="dp-chips" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {["🏆 India's #1 Rated","🎓 10,000+ Alumni","🤝 200+ Partners","⭐ 4.9/5 Rating"].map(chip => (
                    <span key={chip} style={{ background: "#F2F5FF", border: "1.5px solid #BFD2FF", borderRadius: 999, padding: "7px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#1429D0", fontWeight: 500 }}>{chip}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { year: "2019", title: "The Spark",           desc: "DataPreneur was born from a simple frustration. Started with 12 students and a single Python course.",                                        iconKey: "rocket",    isLast: false, delay: 0 },
                  { year: "2020", title: "Going Digital",        desc: "Expanded fully online, reaching students across all of India and launching our signature Data Analytics bootcamp.",                          iconKey: "laptop",    isLast: false, delay: 120 },
                  { year: "2021", title: "1,000 Students",       desc: "Crossed our first major milestone. Success stories started spreading across LinkedIn and India's data community.",                           iconKey: "celebrate", isLast: false, delay: 240 },
                  { year: "2023", title: "AI Curriculum Launch", desc: "Launched India's first practitioner-designed AI & ML career track with real-world projects.",                                               iconKey: "robot",     isLast: false, delay: 360 },
                  { year: "2025", title: "10,000+ & Growing",    desc: "Recognized as India's Premier Data & AI Career School. 200+ hiring partners. The journey has only just begun.",                             iconKey: "trophy",    isLast: true,  delay: 480 },
                ].map((item) => <TimelineItem key={item.year} {...item} inView={timelineInView} />)}
              </div>
            </div>
          </div>
        </section>

        {/* ══════ TEAM ══════ */}
        <section ref={teamRef} className="dp-section-pad" style={{ background: "#F5F7FA", padding: "90px 0" }}>
          <div className="dp-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 56, opacity: teamInView ? 1 : 0, transform: teamInView ? "translateY(0)" : "translateY(24px)", transition: "all 0.65s cubic-bezier(0.16,1,0.3,1)" }}>
              <SectionLabel>The Team</SectionLabel>
              <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, color: "#161619", lineHeight: 1.15, marginTop: 4 }}>
                Minds Behind <span className="dp-gradient">DataPreneur</span>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280", fontSize: 16, maxWidth: 480, margin: "16px auto 0", lineHeight: 1.7 }}>
                Data scientists, engineers, educators, and career coaches united by one mission.
              </p>
            </div>
            <div className="four-col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              <TeamCard name="Arjun Mehta"    role="Founder & CEO"           initials="AM" gradient="linear-gradient(135deg,#1429D0,#0E7FDD)" delay={0}   inView={teamInView} />
              <TeamCard name="Priya Nair"     role="Chief Learning Officer"  initials="PN" gradient="linear-gradient(135deg,#0E7FDD,#1429D0)" delay={120} inView={teamInView} />
              <TeamCard name="Rohan Das"      role="Head of Placements"      initials="RD" gradient="linear-gradient(135deg,#1E3A8A,#1429D0)" delay={240} inView={teamInView} />
              <TeamCard name="Sneha Kulkarni" role="Lead Data Scientist"     initials="SK" gradient="linear-gradient(135deg,#1429D0,#1E3A8A)" delay={360} inView={teamInView} />
            </div>
          </div>
        </section>

        {/* ══════ PARTNERS MARQUEE ══════ */}
        <section ref={partnersRef} style={{ background: "#fff", padding: "64px 0", borderTop: "1.5px solid #E8EEFF", borderBottom: "1.5px solid #E8EEFF", overflow: "hidden" }}>
          <div style={{ textAlign: "center", marginBottom: 36, padding: "0 20px", opacity: partnersInView ? 1 : 0, transition: "all 0.65s cubic-bezier(0.16,1,0.3,1)" }}>
            <SectionLabel>Hiring Partners</SectionLabel>
            <h3 style={{ fontFamily: "'Clash Display', sans-serif", color: "#161619", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, marginTop: 4 }}>
              Our Graduates Work at <span className="dp-gradient">Dream Companies</span>
            </h3>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div className="marquee-track">
              {[...Array(2)].map((_, copy) =>
                companies.map((co, i) => {
                  const Logo = CompanyLogos[co];
                  return (
                    <div key={`${copy}-${i}`} style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      background: "#F5F7FA", border: "1.5px solid #E8EEFF",
                      borderRadius: 12, padding: "14px 28px", marginRight: 16,
                      flexShrink: 0, minWidth: 150, height: 58,
                    }}>
                      {Logo ? <Logo /> : <span style={{ fontFamily: "'Clash Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "#36383E" }}>{co}</span>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* ══════ CTA ══════ */}
        <section ref={ctaRef} className="dp-section-pad" style={{ background: "#F5F7FA", padding: "90px 0", position: "relative", overflow: "hidden" }}>
          <div className="dp-grid-bg" style={{ position: "absolute", inset: 0 }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(20,41,208,0.05) 0%, transparent 70%)" }} />
          <div className="dp-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}>
            <div className="dp-cta-inner" style={{
              background: "linear-gradient(135deg, #1429D0 0%, #1E3A8A 100%)",
              borderRadius: 32, padding: "64px",
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center",
              boxShadow: "0 24px 80px rgba(20,41,208,0.28)",
              position: "relative", overflow: "hidden",
              opacity: ctaInView ? 1 : 0, transform: ctaInView ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.85s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <div className="dp-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
              <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "5px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 20 }}>Start Your Journey</div>
                <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
                  Your Data Career<br />Starts Here.
                </h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.7 }}>
                  Join 10,000+ professionals who transformed their careers with DataPreneur. The future is built on data — be the one who builds it.
                </p>
              </div>

              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { Icon: IconGradCapWhite, text: "Free career counseling session" },
                  { Icon: IconBriefcase,    text: "Placement support from Day 1" },
                  { Icon: IconCreditCard,   text: "Flexible EMI & scholarship options" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <item.Icon />
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.85)", fontSize: 15 }}>{item.text}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                  {/* ── Fix 2: was setEnrollModalOpen(true), now correctly setModalOpen(true) ── */}
                  <button
                    onClick={() => setModalOpen(true)}
                    style={{ background: "#fff", color: "#1429D0", border: "none", cursor: "pointer", borderRadius: 12, padding: "14px 28px", fontFamily: "'Clash Grotesk', sans-serif", fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.22s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
                  >
                    Start Learning Today →
                  </button>
                  <button
                    onClick={() => window.open("https://wa.me/919305823308?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20programs%20at%20DataPreneur.", "_blank")}
                    style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", cursor: "pointer", borderRadius: 12, padding: "14px 24px", fontFamily: "'Clash Grotesk', sans-serif", fontSize: 15, fontWeight: 500, transition: "all 0.22s ease" }}
                  >
                    Talk to Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}