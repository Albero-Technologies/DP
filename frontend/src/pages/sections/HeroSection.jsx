import { Link } from "react-router-dom";
import { Award, MonitorPlay, ShieldCheck, Headphones, GraduationCap } from 'lucide-react';

const stats = [
  { num: "2,400+", label: "Alumni Placed" },
  { num: "100%", label: "Placement Rate" },
  { num: "180+", label: "Hiring Partners" },
  { num: "4.9★", label: "Average Rating" },
];

// ── Real brand SVG logos ──────────────────────────────────────────
const LogoKPMG = () => (
  <svg viewBox="0 0 120 40" width="72" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="30" fontFamily="Arial" fontWeight="900" fontSize="28" fill="#00338D">KPMG</text>
  </svg>
);
const LogoDeloitte = () => (
  <svg viewBox="0 0 130 36" width="86" height="24" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="27" fontFamily="Arial" fontWeight="700" fontSize="22" fill="#86BC25">deloitte.</text>
  </svg>
);
const LogoEY = () => (
  <svg viewBox="0 0 60 36" width="48" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="36" rx="4" fill="#FFE600" />
    <text x="8" y="26" fontFamily="Arial" fontWeight="900" fontSize="24" fill="#2E2E38">EY</text>
  </svg>
);
const LogoPwC = () => (
  <svg viewBox="0 0 80 36" width="60" height="28" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="27" fontFamily="Arial" fontWeight="700" fontSize="26" fill="#E0301E">PwC</text>
  </svg>
);
const LogoMcKinsey = () => (
  <svg viewBox="0 0 140 36" width="90" height="22" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="26" fontFamily="Arial" fontWeight="700" fontSize="20" fill="#003366">McKinsey</text>
  </svg>
);
const LogoAccenture = () => (
  <svg viewBox="0 0 140 40" width="88" height="26" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="28" fontFamily="Arial" fontWeight="700" fontSize="22" fill="#A100FF">Accenture</text>
    <polygon points="126,4 136,14 126,24" fill="#A100FF" />
  </svg>
);
const LogoAmazon = () => (
  <svg viewBox="0 0 100 42" width="70" height="28" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="24" fontFamily="Arial" fontWeight="900" fontSize="22" fill="#232F3E">amazon</text>
    <path d="M8 32 Q35 42 70 34" stroke="#FF9900" strokeWidth="3" fill="none" strokeLinecap="round" />
    <polygon points="66,30 72,34 67,38" fill="#FF9900" />
  </svg>
);
const LogoGoogle = () => (
  <svg viewBox="0 0 110 36" width="70" height="24" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="27" fontFamily="Arial" fontWeight="700" fontSize="26">
      <tspan fill="#4285F4">G</tspan>
      <tspan fill="#EA4335">o</tspan>
      <tspan fill="#FBBC05">o</tspan>
      <tspan fill="#4285F4">g</tspan>
      <tspan fill="#34A853">l</tspan>
      <tspan fill="#EA4335">e</tspan>
    </text>
  </svg>
);
const LogoFlipkart = () => (
  <svg viewBox="0 0 110 36" width="72" height="24" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="27" fontFamily="Arial" fontWeight="900" fontSize="22" fill="#2874F0">Flipkart</text>
  </svg>
);

const companies = [
  { Logo: LogoKPMG, bg: "#EFF6FF", border: "#003087" },
  { Logo: LogoDeloitte, bg: "#F0FDF4", border: "#86BC25" },
  { Logo: LogoEY, bg: "#FEFCE8", border: "#E5CC00" },
  { Logo: LogoPwC, bg: "#FEF2F2", border: "#E0301E" },
  { Logo: LogoMcKinsey, bg: "#EFF6FF", border: "#003366" },
  { Logo: LogoAccenture, bg: "#FAF5FF", border: "#A100FF" },
  { Logo: LogoAmazon, bg: "#FFF7ED", border: "#FF9900" },
  { Logo: LogoGoogle, bg: "#F8F9FF", border: "#4285F4" },
  { Logo: LogoFlipkart, bg: "#EFF6FF", border: "#2874F0" },
];

// ── Right-side visual ─────────────────────────────────────────────
function PlacementWall() {
  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <style>{`
        @keyframes flt4  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes flt4b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>

      {/* ── Top row: two gradient cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
        marginBottom: "0.75rem",
        animation: "flt4 5s ease-in-out infinite",
      }}>
        {/* Card 1 — Highest Package */}
        <div style={{
          background: "linear-gradient(145deg, #1e3eca 0%, #1e6fe0 100%)",
          borderRadius: 18,
          padding: "1.5rem 1.2rem 1.4rem",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "0.55rem",
          boxShadow: "0 12px 36px rgba(20,41,208,0.32)",
          minHeight: 170,
          justifyContent: "center",
        }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="10" fill="rgba(255,255,255,0.12)" />
            <rect x="8" y="17" width="28" height="18" rx="3.5" fill="#F59E0B" opacity="0.9" />
            <path d="M16 17V14a2 2 0 012-2h8a2 2 0 012 2v3" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <rect x="8" y="22" width="28" height="2.5" fill="rgba(0,0,0,0.12)" />
            <rect x="19" y="21" width="6" height="5" rx="1" fill="#fff" opacity="0.9" />
          </svg>
          <div style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.8rem", fontWeight: 500, fontFamily: "'DM Sans',sans-serif", textAlign: "center" }}>
            Highest Package
          </div>
          <div style={{ color: "#fff", fontSize: "1.65rem", fontWeight: 900, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.5px", lineHeight: 1 }}>
            ₹35+ LPA
          </div>
        </div>

        {/* Card 2 — Next Batch */}
        <div style={{
          background: "linear-gradient(145deg, #1550d8 0%, #1a8ce8 100%)",
          borderRadius: 18,
          padding: "1.5rem 1.2rem 1.4rem",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "0.55rem",
          boxShadow: "0 12px 36px rgba(20,41,208,0.28)",
          minHeight: 170,
          justifyContent: "center",
        }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="10" fill="rgba(255,255,255,0.12)" />
            <rect x="8" y="13" width="28" height="22" rx="3.5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            <rect x="8" y="13" width="28" height="8" rx="3.5" fill="rgba(255,255,255,0.2)" />
            <line x1="16" y1="10" x2="16" y2="16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <line x1="28" y1="10" x2="28" y2="16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <rect key={n} x={13 + (n % 5) * 5} y={25 + Math.floor(n / 5) * 5} width="2.5" height="2.5" rx="0.6" fill="rgba(255,255,255,0.7)" />
            ))}
          </svg>
          <div style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.8rem", fontWeight: 500, fontFamily: "'DM Sans',sans-serif", textAlign: "center" }}>
            Next Batch
          </div>
          <div style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 900, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.3px", lineHeight: 1.15, textAlign: "center" }}>
            10 May 2024
          </div>
        </div>
      </div>

      {/* ── Bottom: Alumni logo card ── */}
      <div style={{
        background: "#fff",
        borderRadius: 18,
        padding: "1.1rem 1.1rem 1rem",
        boxShadow: "0 8px 32px rgba(20,41,208,0.08)",
        border: "1px solid rgba(20,41,208,0.07)",
        animation: "flt4b 6s ease-in-out infinite 0.5s",
      }}>
        <div style={{
          fontSize: "0.62rem", fontWeight: 700, color: "#94A3B8",
          letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.85rem",
          fontFamily: "'DM Sans',sans-serif",
        }}>
          Our Alumni Work At
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
          {companies.map(({ Logo, bg, border }, i) => (
            <div key={i} style={{
              background: bg, borderRadius: 10,
              padding: "0.6rem 0.4rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1.5px solid ${border}22`,
              minHeight: 46,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              overflow: "hidden",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 18px ${border}33`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <Logo />
            </div>
          ))}
        </div>

        <div style={{
          marginTop: "0.8rem", padding: "0.6rem 0.85rem",
          background: "#F8F9FF", borderRadius: 9,
          display: "flex", alignItems: "center", gap: "0.5rem",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#1429D0" strokeWidth="1.8" />
            <path d="M12 6v6l4 2" stroke="#1429D0" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "0.68rem", color: "#64748B", fontFamily: "'DM Sans',sans-serif" }}>
            Avg. placement in <strong style={{ color: "#1429D0" }}>47 days</strong> after completion
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main HeroSection ──────────────────────────────────────────────
export default function HeroSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        :root {
          --primary: #1429D0;
          --primary-hover: #0e1fb0;
          --secondary: #0E7FDD;
          --accent: #BFD2FF;
          --bg1: #161619;
          --bg2: #262832;
          --heading: #1e3a8a;
          --body-text: #36383e;
          --bg-light1: #F5F7FA;
          --bg-light2: #F2F5FF;
          --card-shadow: 0 8px 40px rgba(20,41,208,0.13);
        }

        /* ── Base reset for hero ── */
        .hero-section *,
        .hero-section *::before,
        .hero-section *::after {
          box-sizing: border-box;
        }

        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          /* More top padding on mobile to clear the fixed navbar */
          padding: 120px 5% 60px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #F2F5FF 0%, #F5F7FA 50%, #e8eeff 100%);
          font-family: 'DM Sans', sans-serif;
        }

        .hero-blob-1 {
          position: absolute;
          top: -120px; right: -80px;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(20,41,208,0.10) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .hero-blob-2 {
          position: absolute;
          bottom: -100px; left: -60px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14,127,221,0.09) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .hero-grid-overlay {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(20,41,208,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,41,208,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }

        /* ── Two-column layout ── */
        .hero-inner {
          display: flex;
          align-items: center;
          gap: 4rem;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        /* ── Left content ── */
        .hero-content {
          position: relative;
          z-index: 1;
          flex: 1;
          min-width: 0;
          animation: fadeUp 0.6s ease both;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.1rem;
          border-radius: 100px;
          background: rgba(20,41,208,0.08);
          border: 1px solid rgba(20,41,208,0.2);
          color: #1429D0;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1.6rem;
          backdrop-filter: blur(8px);
          letter-spacing: 0.01em;
          animation: fadeUp 0.6s ease 0s both;
        }

        .hero-h1 {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(2.2rem, 5vw, 4.2rem);
          font-weight: 900;
          line-height: 1.06;
          letter-spacing: -1.5px;
          color: #161619;
          margin: 0 0 1.4rem;
          animation: fadeUp 0.6s ease 0.1s both;
        }
        .hero-h1 .gradient-text {
          background: linear-gradient(135deg, #1429D0 0%, #0E7FDD 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-para {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #36383e;
          max-width: 520px;
          margin: 0 0 2.4rem;
          animation: fadeUp 0.6s ease 0.2s both;
          font-weight: 400;
        }

        .hero-btns {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          animation: fadeUp 0.6s ease 0.3s both;
        }
        .btn-primary {
          font-family: 'DM Sans', sans-serif;
          padding: 0.9rem 2.2rem;
          border-radius: 10px;
          border: none;
          background: #1429D0;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(20,41,208,0.30);
          transition: all 0.22s cubic-bezier(.4,0,.2,1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }
        .btn-primary:hover {
          background: #0e1fb0;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(20,41,208,0.38);
        }
        .btn-secondary {
          font-family: 'DM Sans', sans-serif;
          padding: 0.9rem 2.2rem;
          border-radius: 10px;
          border: 1.5px solid rgba(20,41,208,0.25);
          background: rgba(255,255,255,0.85);
          color: #1429D0;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: all 0.22s cubic-bezier(.4,0,.2,1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          white-space: nowrap;
        }
        .btn-secondary:hover {
          border-color: #1429D0;
          background: #F2F5FF;
          transform: translateY(-2px);
        }

        .hero-pills {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-top: 2rem;
          animation: fadeUp 0.6s ease 0.4s both;
        }
        .hero-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(20,41,208,0.13);
          font-size: 0.8rem;
          font-weight: 500;
          color: #262832;
          box-shadow: 0 1px 6px rgba(20,41,208,0.07);
          backdrop-filter: blur(6px);
          transition: all 0.18s;
          white-space: nowrap;
        }
        .hero-pill:hover {
          background: #F2F5FF;
          border-color: rgba(20,41,208,0.3);
          transform: translateY(-1px);
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
          margin-top: 3rem;
          flex-wrap: wrap;
          animation: fadeUp 0.6s ease 0.45s both;
          padding-top: 2.2rem;
          border-top: 1px solid rgba(20,41,208,0.10);
        }
        .stat-num {
          font-family: 'DM Sans', sans-serif;
          font-size: 2.1rem;
          font-weight: 900;
          color: #1429D0;
          line-height: 1;
          letter-spacing: -1px;
        }
        .stat-label {
          font-size: 0.78rem;
          color: #36383e;
          margin-top: 0.3rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .stat-item { position: relative; }
        .stat-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: -1rem;
          top: 10%; height: 80%; width: 1px;
          background: rgba(20,41,208,0.12);
        }

        /* ── Right visual ── */
        .hero-visual {
          flex-shrink: 0;
          width: 460px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Tablet (768px – 1024px): stack visual below content ── */
        @media (max-width: 1024px) {
          .hero-inner {
            flex-direction: column;
            gap: 2.5rem;
            align-items: flex-start;
          }
          .hero-visual {
            width: 100%;
            max-width: 520px;
            align-self: center;
          }
          .hero-section {
            padding: 110px 5% 60px;
            min-height: auto;
          }
          .hero-stats { gap: 1.5rem; }
        }

        /* ── Small tablet / large phone (600px – 768px) ── */
        @media (max-width: 768px) {
          .hero-section { padding: 100px 5% 50px; }
          .hero-h1 { letter-spacing: -1px; }
          .hero-para { font-size: 0.98rem; margin-bottom: 2rem; }
          .stat-item:not(:last-child)::after { display: none; }
          .hero-stats { gap: 1.2rem; }
        }

        /* ── Mobile (≤600px): full single column ── */
        @media (max-width: 600px) {
          .hero-section { padding: 90px 4% 48px; }
          .hero-btns { flex-direction: column; }
          .btn-primary,
          .btn-secondary { width: 100%; }
          .hero-pills { gap: 0.4rem; }
          .hero-stats { gap: 1rem; margin-top: 2rem; padding-top: 1.6rem; }
          .stat-num { font-size: 1.7rem; }
          /* Show the visual on mobile too but compact */
          .hero-visual { max-width: 100%; }
        }

        /* ── Very small phones (≤400px) ── */
        @media (max-width: 400px) {
          .hero-section { padding: 85px 4% 40px; }
          .hero-badge { font-size: 0.72rem; padding: 0.35rem 0.85rem; }
          .btn-primary,
          .btn-secondary { padding: 0.8rem 1.5rem; font-size: 0.92rem; }
          .hero-pill { font-size: 0.74rem; padding: 0.35rem 0.75rem; }
        }
      `}</style>

      <section className="hero-section">
        <div className="hero-blob-1" />
        <div className="hero-blob-2" />
        <div className="hero-grid-overlay" />

        <div className="hero-inner">
          {/* ── LEFT ── */}
          <div className="hero-content">
            <div className="hero-badge">
              <Award size={14} />
              Collaboration with Microsoft and IBM
            </div>

            <h1 className="hero-h1">
              Launch Your{" "}
              <span className="gradient-text">Data Career</span>
              <br />with India's Best
            </h1>

            <p className="hero-para">
              Live cohorts in Data Analytics, Data Science, AI & Investment Banking.
              Real projects, real mentors, real placement support — until you're hired.
            </p>

            <div className="hero-btns">
              <button
                className="btn-primary"
                onClick={() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Book Free Counselling →
              </button>
              <Link
                to="#programs"
                onClick={e => {
                  e.preventDefault();
                  document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{ textDecoration: "none" }}
              >
                <button className="btn-secondary">Explore Programs ↓</button>
              </Link>
            </div>

            <div className="hero-pills">
              {[
                { icon: <MonitorPlay size={14} />, text: "Live Classes" },
                { icon: <ShieldCheck size={14} />, text: "100% Placement Support" },
                { icon: <GraduationCap size={14} />, text: "Dual Certificate" },
                { icon: <Headphones size={14} />, text: "24/7 Mentor Access" },
              ].map((p, i) => (
                <span key={i} className="hero-pill">{p.icon} {p.text}</span>
              ))}
            </div>

            <div className="hero-stats">
              {stats.map(({ num, label }) => (
                <div key={label} className="stat-item">
                  <div className="stat-num">{num}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="hero-visual">
            <PlacementWall />
          </div>
        </div>
      </section>
    </>
  );
}