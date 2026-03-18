import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FloatingCTA() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  if (!show) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800;900&display=swap');
        @keyframes dpFloatUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dp-float-btn:hover {
          background: #1E3A8A !important;
          transform: translateY(-3px) !important;
          box-shadow: 0 14px 40px rgba(20,41,208,0.45) !important;
        }
        .dp-float-btn:hover .dp-float-icon {
          transform: rotate(-12deg) scale(1.15);
        }
        .dp-float-icon {
          transition: transform 0.22s ease;
        }
      `}</style>

      <div style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 999,
        animation: "dpFloatUp 0.3s ease",
      }}>
        <button
          className="dp-float-btn"
          style={{
            display: "flex", alignItems: "center", gap: "0.55rem",
            padding: "0.85rem 1.5rem",
            borderRadius: 14, border: "none",
            background: "#1429D0",
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem", fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 8px 30px rgba(20,41,208,0.38)",
            transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
          onClick={() => {
            if (window.location.pathname === "/") {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            } else {
              navigate("/");
              setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }
          }}
        >
          {/* Graduation cap SVG icon */}
          <span className="dp-float-icon" style={{ display: "flex", alignItems: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 22,8 12,14 2,8" fill="rgba(255,255,255,0.9)" />
              <path d="M6 10.5v5c0 0 2.5 2.5 6 2.5s6-2.5 6-2.5v-5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="22" y1="8" x2="22" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="22" cy="14.5" r="1.2" fill="rgba(255,255,255,0.7)" />
            </svg>
          </span>
          Book Free Session
        </button>
      </div>
    </>
  );
}