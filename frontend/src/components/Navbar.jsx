import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COURSES } from "../data/courses";
import EnrollModal from "./EnrollModel";

// ─── Brand tokens  color code ────────────────────────────────────────────────
const B = {
  primary: "#1429D0",
  secondary: "#0E7FDD",
  hover: "#1E3A8A",
  accentLt: "#BFD2FF",
  bg1: "#F5F7FA",
  bg2: "#F2F5FF",
  dark: "#161619",
  heading: "#262832",
  body: "#36383e",
  border: "rgba(20,41,208,0.12)",
};

// ─── Realistic inline SVG icons ──────────────────────────────────

const IconDataAnalytics = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="13" width="3" height="7" rx="1" fill="#BFD2FF" />
    <rect x="9" y="9" width="3" height="11" rx="1" fill="#0E7FDD" />
    <rect x="15" y="5" width="3" height="15" rx="1" fill="#1429D0" />
    <path d="M2 21h20" stroke="#1429D0" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconAI = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4" stroke="#1429D0" strokeWidth="1.6" />
    <circle cx="5" cy="12" r="1.5" fill="#0E7FDD" />
    <circle cx="19" cy="12" r="1.5" fill="#0E7FDD" />
    <circle cx="12" cy="5" r="1.5" fill="#0E7FDD" />
    <circle cx="12" cy="19" r="1.5" fill="#0E7FDD" />
    <line x1="7" y1="12" x2="10" y2="12" stroke="#1429D0" strokeWidth="1.4" />
    <line x1="14" y1="12" x2="17" y2="12" stroke="#1429D0" strokeWidth="1.4" />
    <line x1="12" y1="7" x2="12" y2="10" stroke="#1429D0" strokeWidth="1.4" />
    <line x1="12" y1="14" x2="12" y2="17" stroke="#1429D0" strokeWidth="1.4" />
  </svg>
);

const IconFinance = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="6" rx="7" ry="2.5" fill="#BFD2FF" />
    <path d="M5 6v4c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5V6" stroke="#1429D0" strokeWidth="1.5" />
    <path d="M5 10v4c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5v-4" stroke="#1429D0" strokeWidth="1.5" />
    <path d="M5 14v4c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5v-4" stroke="#1429D0" strokeWidth="1.5" />
  </svg>
);

const IconBusiness = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 17l5-5 4 3 7-8" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 7h5v5" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 21h20" stroke="#1429D0" strokeWidth="1.2" opacity="0.4" />
  </svg>
);

const IconCompass = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#1429D0" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="2" fill="#1429D0" />
    <polygon points="16.5,7.5 14,12 12,10 16.5,7.5" fill="#1429D0" />
    <polygon points="7.5,16.5 10,12 12,14 7.5,16.5" fill="#0E7FDD" opacity="0.6" />
    <line x1="12" y1="3" x2="12" y2="5" stroke="#1429D0" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="12" y1="19" x2="12" y2="21" stroke="#1429D0" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="3" y1="12" x2="5" y2="12" stroke="#1429D0" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="19" y1="12" x2="21" y2="12" stroke="#1429D0" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconCertified = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="9" r="5.5" fill="#BFD2FF" stroke="#1429D0" strokeWidth="1.5" />
    <polyline points="9,9 11,11 15,7" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 14l-2 7 5-3 5 3-2-7" stroke="#1429D0" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconPlacement = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="8" width="18" height="11" rx="2" fill="#F2F5FF" stroke="#1429D0" strokeWidth="1.5" />
    <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#1429D0" strokeWidth="1.5" />
    <polyline points="9,13 11,15 15,11" stroke="#1429D0" strokeWidth="1.8" />
  </svg>
);

const IconMentors = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3.5" fill="#BFD2FF" stroke="#1429D0" strokeWidth="1.5" />
    <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="#1429D0" strokeWidth="1.5" />
    <polygon points="12,2 22,6 12,10 2,6" fill="#F2F5FF" stroke="#1429D0" strokeWidth="1.4" />
  </svg>
);

const IconOutcomes = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="14" width="3.5" height="6" rx="1" fill="#BFD2FF" />
    <rect x="8.5" y="10" width="3.5" height="10" rx="1" fill="#0E7FDD" />
    <rect x="14" y="5" width="3.5" height="15" rx="1" fill="#1429D0" />
    <path d="M2 21h20" stroke="#262832" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
    <path d="M3 14 8.5 10 14 5" stroke="#1429D0" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

const IconSuccess = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="#F2F5FF" stroke="#1429D0" strokeWidth="1.5" />
    <polyline points="7,12 10,15 17,8" stroke="#1429D0" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Course icons
const IconCourse = {
  "data-analytics": IconDataAnalytics,
  "business-analytics": IconBusiness,
  "data-science-ai": IconAI,
  "agentic-ai-prompt-engineering": () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polygon
        points="13,2 4,13 11,13 10,22 20,10 13,10"
        fill="#BFD2FF"
        stroke="#1429D0"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "investment-banking": IconFinance,
  "data-ai-masters-track": () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 18l5-5 4 3 7-9" stroke="#1429D0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7h5v5" stroke="#1429D0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="20" width="18" height="1.5" rx="1" fill="#BFD2FF" />
    </svg>
  ),
};

// ─── Mega menu data (Resources removed) ──────────────────────────
const MEGA_MENU = [
  {
    label: "Programs",
    categories: [
      { key: "data", label: "Data & Analytics", Icon: IconDataAnalytics, courses: [] },
      { key: "ai", label: "AI & Machine Learning", Icon: IconAI, courses: [] },
      { key: "finance", label: "Finance & Banking", Icon: IconFinance, courses: [] },
      { key: "business", label: "Business Analytics", Icon: IconBusiness, courses: [] },
    ],
  },
  {
    label: "Why DataPreneur", simple: true,
    links: [
      { Icon: IconCompass, title: "Our Approach", sub: "Small cohorts, real outcomes" },
      { Icon: IconCertified, title: "Microsoft Certified", sub: "Globally recognized credentials" },
      { Icon: IconPlacement, title: "Placement Support", sub: "180+ hiring partners" },
      { Icon: IconMentors, title: "Our Mentors", sub: "Industry professionals, not teachers" },
      { Icon: IconOutcomes, title: "Student Outcomes", sub: "94% placement rate" },
      { Icon: IconSuccess, title: "Success Stories", sub: "Real journeys, real salaries" },
    ],
  },
];

// Small utility icons
const ChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const ChevronRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ArrowRight = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const XIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Mobile accordion section ──────────────────────────────────────────────────
function MobileSection({ label, children, accent, border }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="dp-mobile-section-header" onClick={() => setOpen(o => !o)}>
        {label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "none" }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
      {open && (
        <div style={{ paddingBottom: "0.5rem" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [activeCat, setActiveCat] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef(null);
  const navigate = useNavigate();
  // Enroll modal state
  const [modalOpen, setModalOpen] = useState(false);

  // Populate course lists from COURSES data
  MEGA_MENU[0].categories[0].courses = COURSES.filter(c => c.cat.includes("data"));
  MEGA_MENU[0].categories[1].courses = COURSES.filter(c => c.cat.includes("ai"));
  MEGA_MENU[0].categories[2].courses = COURSES.filter(c => c.cat.includes("finance"));
  MEGA_MENU[0].categories[3].courses = COURSES.filter(c => c.cat.includes("business"));

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const open = useCallback((lbl) => { clearTimeout(closeTimer.current); setOpenMenu(lbl); }, []);
  const close = useCallback(() => { closeTimer.current = setTimeout(() => setOpenMenu(null), 130); }, []);
  const stay = useCallback(() => clearTimeout(closeTimer.current), []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else { navigate("/"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100); }
  };

  const getCourseIcon = (course) => {
    const Comp = IconCourse[course.slug] || IconDataAnalytics;
    return <Comp />;
  };

  return (
    <>
        {/* Enroll modal outside the main section to avoid z-index and overflow issues */}
      <EnrollModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dp-nav-btn-item:hover { color: ${B.primary} !important; border-bottom-color: ${B.primary} !important; }

        /* ── Base: ensure no horizontal overflow ── */
        * { box-sizing: border-box; }

        /* ── Large desktop (1200px+): full layout ── */
        .dp-nav-phone { display: flex !important; }
        .dp-nav-signin { display: inline-flex !important; text-decoration: none; display: flex; align-items: center; }
        .dp-hamburger { display: none !important; }
        .dp-nav-center { display: flex !important; }

        /* ── Tablet (768px – 1100px): hide phone number, shrink gaps ── */
        @media (max-width: 1100px) {
          .dp-nav-phone { display: none !important; }
          .dp-nav-btn-item { padding: 0 0.55rem !important; font-size: 0.81rem !important; }
          .dp-nav-enroll { padding: 0.45rem 0.9rem !important; font-size: 0.8rem !important; }
          .dp-nav-signin { padding: 0.4rem 0.75rem !important; font-size: 0.8rem !important; }
        }

        /* ── Small tablet (768px – 900px): tighten further ── */
        @media (max-width: 900px) {
          .dp-nav-btn-item { padding: 0 0.4rem !important; font-size: 0.78rem !important; }
          .dp-logo { font-size: 1.35rem !important; }
        }

        /* ── Mobile (≤768px): hide center nav, show hamburger ── */
        @media (max-width: 768px) {
          .dp-nav-center  { display: none !important; }
          .dp-nav-actions { gap: 0.4rem !important; }
          .dp-nav-phone   { display: none !important; }
          .dp-nav-signin  { display: none !important; }
          .dp-nav-enroll  { padding: 0.45rem 0.9rem !important; font-size: 0.8rem !important; }
          .dp-hamburger   { display: flex !important; }
          .dp-logo        { font-size: 1.25rem !important; }
          .dp-nav-bar     { padding: 0 4% !important; }
        }

        /* ── Very small phones (≤380px) ── */
        @media (max-width: 380px) {
          .dp-logo        { font-size: 1.1rem !important; }
          .dp-nav-enroll  { padding: 0.4rem 0.7rem !important; font-size: 0.75rem !important; }
          .dp-nav-bar     { padding: 0 3% !important; }
        }

        /* ── Mobile drawer ── */
        .dp-mobile-drawer {
          background: #fff;
          border-bottom: 1px solid ${B.border};
          padding: 0.5rem 5% 1.5rem;
          box-shadow: 0 8px 24px rgba(20,41,208,0.1);
          /* Full height below navbar, scrollable */
          position: fixed;
          top: 66px;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          z-index: 999;
        }

        /* ── Mobile accordion sections ── */
        .dp-mobile-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 0;
          cursor: pointer;
          border-bottom: 1px solid ${B.border};
          font-weight: 700;
          font-size: 0.95rem;
          color: ${B.dark};
          font-family: 'DM Sans', sans-serif;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .dp-mobile-section-header:hover { color: ${B.primary}; }

        .dp-mobile-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 0.75rem;
          font-size: 0.85rem;
          color: ${B.body};
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }
        .dp-mobile-link:hover,
        .dp-mobile-link:active { background: ${B.bg2}; color: ${B.primary}; }

        .dp-mobile-course-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.55rem 0.75rem;
          font-size: 0.84rem;
          color: ${B.primary};
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .dp-mobile-course-link:hover,
        .dp-mobile-course-link:active { background: ${B.bg2}; }

        /* ── Mega dropdown: tablet adjustments ── */
        @media (max-width: 1100px) {
          .dp-mega-sidebar { width: 200px !important; }
          .dp-mega-courses-panel { padding: 1.2rem 1.5rem 1.5rem !important; }
          .dp-why-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ── Safe area insets for notched phones ── */
        @supports (padding: max(0px)) {
          .dp-mobile-drawer {
            padding-left: max(5%, env(safe-area-inset-left));
            padding-right: max(5%, env(safe-area-inset-right));
            padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>

      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        {/* ── Main bar ── */}
        <nav
          className="dp-nav-bar"
          style={{
            display: "flex", alignItems: "center",
            padding: "0 4%", height: 66,
            background: scrolled ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.94)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            borderBottom: `1px solid ${scrolled ? "rgba(20,41,208,0.10)" : "rgba(20,41,208,0.06)"}`,
            boxShadow: scrolled ? "0 4px 24px rgba(20,41,208,0.08)" : "0 2px 8px rgba(20,41,208,0.04)",
            transition: "all 0.25s ease",
          }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0, marginRight: "2rem" }}>
            <span className="dp-logo" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.04em", color: B.dark, userSelect: "none" }}>
              Data<span style={{ color: B.primary }}>Preneur</span>
            </span>
          </Link>

          {/* Center nav */}
          <div className="dp-nav-center" style={{ display: "flex", alignItems: "stretch", flex: 1, height: "100%", minWidth: 0 }}>
            {MEGA_MENU.map((item) => {
              const isOpen = openMenu === item.label;
              return (
                <div key={item.label} style={{ position: "relative", display: "flex", alignItems: "center" }}
                  onMouseEnter={() => open(item.label)} onMouseLeave={close}>
                  <button
                    className="dp-nav-btn-item"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "0.3rem",
                      padding: "0 1rem", height: "100%",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.88rem", fontWeight: isOpen ? 700 : 600,
                      color: isOpen ? B.primary : B.heading,
                      borderBottom: `2.5px solid ${isOpen ? B.primary : "transparent"}`,
                      transition: "all 0.2s", whiteSpace: "nowrap",
                    }}>
                    {item.label}
                    <span style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none", display: "flex", color: isOpen ? B.primary : "#94A3B8" }}>
                      <ChevronDown />
                    </span>
                  </button>
                </div>
              );
            })}

            <Link to="/about" style={{ textDecoration: "none", display: "flex", alignItems: "stretch", height: "100%" }} onClick={() => setMobileOpen(false)}>
              <button
                className="dp-nav-btn-item"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "0 1rem", height: "100%",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.88rem", fontWeight: 600, color: B.heading,
                  borderBottom: "2.5px solid transparent", transition: "all 0.2s", whiteSpace: "nowrap",
                }}>
                About Us
              </button>
            </Link>
            <button onClick={() => scrollTo("contact")}
              className="dp-nav-btn-item"
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "0 1rem", height: "100%",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.88rem", fontWeight: 600, color: B.heading,
                borderBottom: "2.5px solid transparent", transition: "all 0.2s", whiteSpace: "nowrap",
              }}>
              Contact
            </button>
          </div>

          {/* Right actions */}
          <div className="dp-nav-actions" style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0, marginLeft: "auto" }}>
            <a href="tel:+919810000000" className="dp-nav-phone"
              style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                fontSize: "0.8rem", fontWeight: 600, color: B.primary,
                textDecoration: "none", padding: "0.38rem 0.85rem",
                border: `1.5px solid ${B.accentLt}`, borderRadius: 8, background: B.bg2,
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#e4ecff"; e.currentTarget.style.borderColor = B.primary; }}
              onMouseLeave={e => { e.currentTarget.style.background = B.bg2; e.currentTarget.style.borderColor = B.accentLt; }}>
              <PhoneIcon />
              +91-98100-00000
            </a>

            <Link className="dp-nav-signin"
              to="/signin"
              style={{
                padding: "0.46rem 1.1rem", borderRadius: 8,
                border: `1.5px solid rgba(20,41,208,0.18)`, background: "transparent",
                color: B.heading, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", textDecoration: "none",
                display: "flex", alignItems: "center",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = B.primary; e.currentTarget.style.color = B.primary; e.currentTarget.style.background = B.bg2; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(20,41,208,0.18)"; e.currentTarget.style.color = B.heading; e.currentTarget.style.background = "transparent"; }}>
              Sign In
            </Link>

            <button
              className="dp-nav-enroll"
              // onClick={() => scrollTo("contact")}
              onClick={() => setModalOpen(true)}
              style={{
                padding: "0.5rem 1.3rem", borderRadius: 8, border: "none",
                background: B.primary, color: "#fff",
                fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
                boxShadow: "0 4px 14px rgba(20,41,208,0.28)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = B.hover; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(20,41,208,0.36)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = B.primary; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(20,41,208,0.28)"; }}>
              Enroll Now
            </button>

            <button className="dp-hamburger" onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "0.4rem", alignItems: "center", color: B.dark, flexShrink: 0, touchAction: "manipulation" }}>
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>

        {/* ── Mega dropdowns (desktop only) ── */}
        {MEGA_MENU.map((item) => {
          if (openMenu !== item.label) return null;

          // Simple dropdown (Why DataPreneur)
          if (item.simple) {
            return (
              <div key={item.label} onMouseEnter={stay} onMouseLeave={close} style={{
                position: "absolute", left: 0, right: 0,
                background: "rgba(255,255,255,0.99)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                borderTop: `3px solid ${B.primary}`,
                boxShadow: "0 20px 60px rgba(20,41,208,0.12)",
                padding: "1.75rem 5%",
                animation: "dropdownIn 0.18s ease",
              }}>
                <div className="dp-why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem", maxWidth: 820 }}>
                  {item.links.map((lnk, i) => (
                    <div key={i}
                      style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", padding: "0.85rem 1rem", borderRadius: 12, cursor: "pointer", transition: "all 0.15s", border: "1.5px solid transparent" }}
                      onMouseEnter={e => { e.currentTarget.style.background = B.bg2; e.currentTarget.style.borderColor = B.border; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: B.bg2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${B.border}` }}>
                        <lnk.Icon />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.87rem", color: B.heading, marginBottom: "0.15rem", fontFamily: "'DM Sans', sans-serif" }}>{lnk.title}</div>
                        <div style={{ fontSize: "0.76rem", color: "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>{lnk.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Programs mega menu
          const currentCatKey = activeCat[item.label] || item.categories[0].key;
          const currentCat = item.categories.find(c => c.key === currentCatKey) || item.categories[0];

          return (
            <div key={item.label} onMouseEnter={stay} onMouseLeave={close} style={{
              position: "absolute", left: 0, right: 0,
              background: "rgba(255,255,255,0.99)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              borderTop: `3px solid ${B.primary}`,
              boxShadow: "0 24px 60px rgba(20,41,208,0.13)",
              display: "flex", animation: "dropdownIn 0.18s ease", minHeight: 340,
            }}>
              {/* Sidebar */}
              <div className="dp-mega-sidebar" style={{ width: 240, flexShrink: 0, background: B.bg1, borderRight: `1px solid ${B.border}`, padding: "1.5rem 0" }}>
                <div style={{ padding: "0 1.5rem 0.75rem", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>
                  Categories
                </div>
                {item.categories.map((cat) => {
                  const isActive = currentCatKey === cat.key;
                  return (
                    <div key={cat.key}
                      onMouseEnter={() => setActiveCat(p => ({ ...p, [item.label]: cat.key }))}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.8rem 1.5rem",
                        cursor: "pointer",
                        background: isActive ? "#fff" : "transparent",
                        borderLeft: `3px solid ${isActive ? B.primary : "transparent"}`,
                        transition: "all 0.15s",
                      }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: isActive ? B.bg2 : B.bg1, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${isActive ? B.border : "transparent"}`, transition: "all 0.15s" }}>
                        <cat.Icon />
                      </div>
                      <div>
                        <div style={{ fontWeight: isActive ? 700 : 600, fontSize: "0.86rem", color: isActive ? B.primary : B.heading, fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s" }}>
                          {cat.label}
                        </div>
                        <div style={{ fontSize: "0.71rem", color: "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>
                          {cat.courses.length} programs
                        </div>
                      </div>
                      {isActive && <span style={{ marginLeft: "auto", color: B.primary, display: "flex" }}><ChevronRight /></span>}
                    </div>
                  );
                })}
                <div style={{ padding: "1rem 1.5rem 0", borderTop: `1px solid ${B.border}`, marginTop: "0.5rem" }}>
                  <Link to="/#programs" onClick={() => setOpenMenu(null)}
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 700, color: B.primary, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
                    View All Programs <ArrowRight />
                  </Link>
                </div>
              </div>

              {/* Courses panel */}
              <div className="dp-mega-courses-panel" style={{ flex: 1, padding: "1.5rem 2.5rem 2rem", minWidth: 0, overflowY: "auto" }}>
                <div style={{ marginBottom: "1.2rem" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.25rem", fontFamily: "'DM Sans', sans-serif" }}>
                    {currentCat.label}
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 900, color: B.dark, letterSpacing: "-0.03em", fontFamily: "'DM Sans', sans-serif" }}>
                    Find Your Program
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.9rem" }}>
                  {currentCat.courses.map((course) => (
                    <Link key={course.slug} to={`/programs/${course.slug}`} style={{ textDecoration: "none" }} onClick={() => setOpenMenu(null)}>
                      <div
                        style={{ background: B.bg1, border: `1.5px solid ${B.border}`, borderRadius: 14, padding: "1.1rem", cursor: "pointer", transition: "all 0.2s", position: "relative" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = B.primary + "66"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(20,41,208,0.10)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.background = B.bg1; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                        {course.badge && (
                          <div style={{ position: "absolute", top: 9, right: 9, background: B.dark, color: "#fff", fontSize: "0.6rem", fontWeight: 700, padding: "0.18rem 0.48rem", borderRadius: 100 }}>
                            {course.badge}
                          </div>
                        )}
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: B.bg2, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.7rem", border: `1px solid ${B.border}` }}>
                          {getCourseIcon(course)}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: B.dark, marginBottom: "0.25rem", lineHeight: 1.3, fontFamily: "'DM Sans', sans-serif" }}>{course.title}</div>
                        <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.7rem", fontFamily: "'DM Sans', sans-serif" }}>{course.duration} · {course.mode}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.77rem", fontWeight: 700, color: B.primary, fontFamily: "'DM Sans', sans-serif" }}>
                          Explore <ArrowRight size={11} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* CTA banner */}
                <div style={{ marginTop: "1.4rem", padding: "1rem 1.4rem", background: `linear-gradient(135deg, ${B.bg2}, #ede9fe)`, borderRadius: 12, border: `1px solid ${B.accentLt}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", color: B.dark, fontFamily: "'DM Sans', sans-serif" }}>Need Help Choosing?</div>
                    <div style={{ fontSize: "0.77rem", color: "#64748B", marginTop: "0.15rem", fontFamily: "'DM Sans', sans-serif" }}>Book a free 30-min career counselling session with our experts.</div>
                  </div>
                  <button style={{ padding: "0.48rem 1.1rem", borderRadius: 8, border: "none", background: B.primary, color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, boxShadow: "0 4px 12px rgba(20,41,208,0.25)", fontFamily: "'DM Sans', sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.background = B.hover; }}
                    onMouseLeave={e => { e.currentTarget.style.background = B.primary; }}>
                    Book Free Session
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Mobile nav drawer ── */}
        {mobileOpen && (
          <div className="dp-mobile-drawer">

            {/* Mega menu sections as accordions */}
            {MEGA_MENU.map((item) => (
              <MobileSection key={item.label} label={item.label} accent={B.primary} border={B.border}>
                {item.simple && item.links?.map(l => (
                  <div key={l.title} className="dp-mobile-link" onClick={() => setMobileOpen(false)}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: B.bg2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <l.Icon />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.84rem", color: B.heading, fontFamily: "'DM Sans',sans-serif" }}>{l.title}</div>
                      <div style={{ fontSize: "0.72rem", color: "#94A3B8", fontFamily: "'DM Sans',sans-serif" }}>{l.sub}</div>
                    </div>
                  </div>
                ))}
                {!item.simple && item.categories?.map(cat => (
                  <div key={cat.key} style={{ marginBottom: "0.5rem" }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#94A3B8", letterSpacing: "1.5px", textTransform: "uppercase", padding: "0.5rem 0.75rem 0.25rem", fontFamily: "'DM Sans',sans-serif" }}>
                      {cat.label}
                    </div>
                    {cat.courses.map(c => (
                      <Link key={c.slug} to={`/programs/${c.slug}`} className="dp-mobile-course-link" onClick={() => setMobileOpen(false)}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: B.bg2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {getCourseIcon(c)}
                        </div>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>{c.title}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </MobileSection>
            ))}

            {/* About Us */}
            <Link to="/about" style={{ textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
              <div className="dp-mobile-section-header" style={{ borderBottom: `1px solid ${B.border}` }}>
                About Us
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={B.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </Link>

            {/* Contact */}
            <div className="dp-mobile-section-header" style={{ borderBottom: "none" }} onClick={() => { scrollTo("contact"); setMobileOpen(false); }}>
              Contact
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={B.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", paddingTop: "1rem", borderTop: `1px solid ${B.border}` }}>
              <Link to="/signin" style={{
                flex: 1, padding: "0.72rem", borderRadius: 8,
                border: `1.5px solid ${B.border}`, background: "transparent",
                color: B.dark, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem",
                textDecoration: "none", textAlign: "center", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                Sign In
              </Link>
              <button
                // onClick={() => { scrollTo("contact"); setMobileOpen(false); }}
                onClick={() => setModalOpen(true)}
                style={{
                  flex: 1, padding: "0.72rem", borderRadius: 8,
                  border: "none", background: "#1429D0", color: "#fff",
                  fontWeight: 700, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem",
                  boxShadow: "0 4px 14px rgba(20,41,208,0.28)",
                  textAlign: "center",
                }}>
                Enroll Now
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}