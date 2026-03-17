import { Linkedin, Twitter, Youtube, Instagram, Mail, Phone } from 'lucide-react';

const cols = [
  {
    title: "Programs",
    links: ["Data Analytics", "Business Analytics", "Data Science & AI", "Agentic AI", "Investment Banking", "Masters Track"],
  },
  {
    title: "Resources",
    links: ["Blog", "Free Workshops", "Interview Prep", "Career Roadmaps", "Alumni Stories"],
  },
  {
    title: "Company",
    links: ["About Us", "Our Mentors", "Hiring Partners", "Events", "Privacy Policy"],
  },
];

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 14 6 14s6-8.75 6-14c0-3.314-2.686-6-6-6z" fill="#1429D0" opacity=".25" stroke="#1429D0" strokeWidth="1.5"/>
    <circle cx="12" cy="8" r="2.2" fill="#1429D0"/>
  </svg>
);

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        .dp-footer *,
        .dp-footer *::before,
        .dp-footer *::after { box-sizing: border-box; }

        .dp-footer-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr 0.8fr;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .dp-footer-grid {
            grid-template-columns: 1.4fr 1fr 1fr 1fr;
            gap: 2.5rem 2rem;
          }
          .dp-footer-social {
            grid-column: 1;
            grid-row: 2;
          }
        }

        @media (max-width: 768px) {
          .dp-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem 2rem;
          }
          .dp-footer-brand {
            grid-column: 1 / -1;
          }
          .dp-footer-social {
            grid-column: auto;
            grid-row: auto;
          }
        }

        @media (max-width: 480px) {
          .dp-footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .dp-footer-brand {
            grid-column: 1;
          }
        }

        .dp-footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        @media (max-width: 600px) {
          .dp-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }

        /* ── Link hover ── */
        .dp-footer-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .dp-footer-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -2px;
          width: 0; height: 1px;
          background: #1429D0;
          transition: width 0.25s ease;
        }
        .dp-footer-link:hover { color: #BFD2FF !important; }
        .dp-footer-link:hover::after { width: 100%; }

        .dp-link-arrow {
          opacity: 0;
          transform: translateX(-3px);
          transition: all 0.2s ease;
          color: #1429D0;
          font-size: 0.72rem;
        }
        .dp-footer-link:hover .dp-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── Social hover ── */
        .dp-social-btn {
          width: 36px; height: 36px;
          border-radius: 9px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #94A3B8;
          text-decoration: none;
          transition: all 0.22s ease;
        }
        .dp-social-btn:hover {
          background: rgba(20,41,208,0.2) !important;
          border-color: rgba(20,41,208,0.45) !important;
          color: #BFD2FF !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(20,41,208,0.25);
        }

        /* ── Contact row hover ── */
        .dp-contact-row:hover .dp-contact-text { color: #BFD2FF !important; }

        /* ── Column heading ── */
        .dp-col-heading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .dp-col-heading-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(20,41,208,0.3) 0%, transparent 100%);
        }

        /* ── Divider ── */
        .dp-divider {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(20,41,208,0.3) 30%, rgba(20,41,208,0.3) 70%, transparent);
          margin: 3.5rem 0 0;
        }

        /* ── Badge ── */
        .dp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(20,41,208,0.15);
          border: 1px solid rgba(20,41,208,0.3);
          border-radius: 99px;
          padding: 0.22rem 0.7rem;
          font-size: 0.71rem;
          font-weight: 600;
          color: #BFD2FF;
          letter-spacing: 0.03em;
          width: fit-content;
        }
        .dp-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #1429D0;
          box-shadow: 0 0 5px #1429D0;
          animation: dp-blink 2s ease-in-out infinite;
        }
        @keyframes dp-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>

      <footer className="dp-footer" style={{
        background: "#161619",
        padding: "4rem 5% 0",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Ambient glow */}
        <div aria-hidden style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "220px",
          background: "radial-gradient(ellipse 60% 100% at 50% -20%, rgba(20,41,208,0.08) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />

        <div className="dp-footer-grid" style={{ position: "relative" }}>

          {/* Brand column */}
          <div className="dp-footer-brand" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <div className="dp-badge">
              <span className="dp-badge-dot" />
              Enrollments Open
            </div>

            <div style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
              <span style={{ color: "#fff" }}>Data</span>
              <span style={{ color: "#1429D0" }}>Preneur</span>
            </div>

            <p style={{ fontSize: "0.88rem", color: "#94A3B8", lineHeight: 1.7, maxWidth: 270, margin: 0 }}>
              Empowering the next generation of data professionals and financial analysts across India with industry-led mentorship.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginTop: "0.25rem" }}>
              {[
                { icon: <Mail size={13} />, text: "hello@datapreneur.in" },
                { icon: <Phone size={13} />, text: "+91-98100-00000" },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="dp-contact-row"
                  style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", width: "fit-content" }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: 7,
                    background: "rgba(20,41,208,0.12)",
                    border: "1px solid rgba(20,41,208,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#1429D0", flexShrink: 0,
                  }}>
                    {icon}
                  </div>
                  <span className="dp-contact-text" style={{
                    fontSize: "0.84rem", color: "#94A3B8",
                    transition: "color 0.2s ease",
                  }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <div className="dp-col-heading">
                <h4 style={{
                  fontWeight: 700, fontSize: "0.75rem", color: "#fff",
                  letterSpacing: "1.5px", textTransform: "uppercase",
                  margin: 0, whiteSpace: "nowrap",
                }}>
                  {col.title}
                </h4>
                <span className="dp-col-heading-line" />
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.72rem" }}>
                {col.links.map(l => (
                  <li key={l}>
                    <span
                      className="dp-footer-link"
                      style={{
                        fontSize: "0.88rem", color: "#94A3B8",
                        cursor: "pointer", transition: "color 0.2s ease",
                      }}
                    >
                      {l}
                      <span className="dp-link-arrow">›</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social column */}
          <div className="dp-footer-social">
            <div className="dp-col-heading">
              <h4 style={{
                fontWeight: 700, fontSize: "0.75rem", color: "#fff",
                letterSpacing: "1.5px", textTransform: "uppercase",
                margin: 0, whiteSpace: "nowrap",
              }}>
                Connect
              </h4>
              <span className="dp-col-heading-line" />
            </div>
            <div style={{ display: "flex", gap: "0.65rem", alignItems: "center", flexWrap: "wrap" }}>
              {[
                { ico: <Linkedin size={16} />, lab: "LinkedIn"  },
                { ico: <Twitter  size={16} />, lab: "Twitter"   },
                { ico: <Youtube  size={16} />, lab: "YouTube"   },
                { ico: <Instagram size={16}/>, lab: "Instagram" },
              ].map((s, i) => (
                <a key={i} href="#" className="dp-social-btn" title={s.lab}>
                  {s.ico}
                </a>
              ))}
            </div>

            {/* Newsletter nudge */}
            <div style={{
              marginTop: "1.75rem",
              background: "rgba(20,41,208,0.08)",
              border: "1px solid rgba(20,41,208,0.2)",
              borderRadius: 10,
              padding: "0.9rem 1rem",
            }}>
              <p style={{ fontSize: "0.77rem", color: "#94A3B8", margin: "0 0 0.5rem", lineHeight: 1.5 }}>
                Weekly insights on data careers
              </p>
              <a
                href="#"
                style={{
                  fontSize: "0.77rem", fontWeight: 700,
                  color: "#BFD2FF", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: "0.25rem",
                  transition: "gap 0.2s ease",
                }}
                onMouseOver={e => e.currentTarget.style.gap = "0.45rem"}
                onMouseOut={e => e.currentTarget.style.gap = "0.25rem"}
              >
                Subscribe free →
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <hr className="dp-divider" />

        {/* Bottom bar */}
        <div style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
          <div className="dp-footer-bottom" style={{ fontSize: "0.8rem", color: "#4B5563" }}>
            <span>© 2025 DataPreneur Education Pvt. Ltd. All rights reserved.</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#6B7280" }}>
              <PinIcon /> Sector-62, Noida, Uttar Pradesh
            </span>
          </div>
        </div>

      </footer>
    </>
  );
}