import { Clock, Briefcase, Star, ArrowRight } from "lucide-react";
import img1 from "../../assets/mentor1.jpg";
import img2 from "../../assets/mentor2.jpg";
import img3 from "../../assets/mentor3.jpg";
import img4 from "../../assets/mentor4.jpg";
import img5 from "../../assets/mentor5.jpg";

const mentorsData = [
  {
    id: 1,
    name: "Heena Arora",
    role: "Associate Data Scientist",
    company: "PwC (ex-Amazon)",
    years: "3+ years",
    skills: ["Data Science", "Image Analytics", "Python", "SQL"],
    accentColor: "#1429D0",
    image: img1,
  },
  {
    id: 2,
    name: "Anand Tripathi",
    role: "Data Analyst",
    company: "Google",
    years: "1 year",
    skills: ["Data Analytics", "Big Data", "Product Analytics"],
    accentColor: "#0E7FDD",
    image: img2,
  },
  {
    id: 3,
    name: "Shubham",
    role: "Senior Data Scientist",
    company: "RSPL Group",
    years: "5+ years",
    skills: ["Python", "Machine Learning", "SQL"],
    accentColor: "#1E3A8A",
    image: img3,
  },
  {
    id: 4,
    name: "Akshat Khandelwal",
    role: "Senior Finance BI Developer",
    company: "Autodesk",
    years: "5+ years",
    skills: ["Power BI", "Python", "SQL"],
    accentColor: "#1429D0",
    image: img4,
  },
  {
    id: 5,
    name: "Prabhat Singh",
    role: "Data Scientist",
    company: "Cognizant",
    years: "4+ years",
    skills: ["Python", "Machine Learning", "Analytics"],
    accentColor: "#0E7FDD",
    image: img5,
  },
];

export default function MentorsSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        .ms * { box-sizing: border-box; }

        .ms {
          padding: 4.5rem 5%;
          background: #F5F7FA;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ── Background ── */
        .ms-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 50% 50% at 5%  15%, rgba(20,41,208,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 95% 85%, rgba(14,127,221,0.06) 0%, transparent 60%);
        }
        .ms-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(20,41,208,0.055) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 100%);
        }

        .ms-inner {
          max-width: 1200px; margin: 0 auto;
          position: relative; z-index: 1;
        }

        /* ── Header ── */
        .ms-header { text-align: center; margin-bottom: 3.5rem; }

        .ms-label {
          display: inline-flex; align-items: center; gap: 0.45rem;
          background: rgba(20,41,208,0.07);
          border: 1px solid rgba(20,41,208,0.15);
          border-radius: 99px;
          padding: 0.27rem 0.9rem 0.27rem 0.6rem;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; color: #1429D0;
          margin-bottom: 1.1rem;
        }
        .ms-label-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #1429D0;
          animation: ms-blink 2s ease-in-out infinite;
        }
        @keyframes ms-blink { 0%,100%{opacity:1} 50%{opacity:.3} }

        .ms-h2 {
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 900; color: #161619;
          margin-bottom: 0.85rem;
          letter-spacing: -0.03em; line-height: 1.1;
        }
        .ms-h2 em {
          font-style: normal;
          background: linear-gradient(130deg, #1429D0 0%, #0E7FDD 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ms-desc {
          max-width: 500px; margin: 0 auto;
          color: #6B7280; line-height: 1.75; font-size: 1rem;
        }

        /* ── Grid ── */
        .ms-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        /* ── Card ── */
        .ms-card {
          background: #fff;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(20,41,208,0.09);
          box-shadow: 0 4px 20px rgba(20,41,208,0.07);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          cursor: default;
          position: relative;
          display: flex; flex-direction: column;
        }
        .ms-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 20px 52px rgba(20,41,208,0.14);
          border-color: rgba(20,41,208,0.2);
        }

        /* ── Image wrapper ── */
        .ms-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .ms-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: top;
          display: block;
          transition: transform 0.4s ease;
        }
        .ms-card:hover .ms-img { transform: scale(1.04); }

        /* Gradient overlay on image bottom */
        .ms-img-wrap::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.9));
          pointer-events: none;
        }

        /* Accent top bar — coloured per mentor */
        .ms-accent-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
        }

        /* Company badge floating on image */
        .ms-company-badge {
          position: absolute; bottom: 10px; left: 12px;
          display: inline-flex; align-items: center; gap: 0.35rem;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(20,41,208,0.12);
          border-radius: 99px;
          padding: 0.22rem 0.7rem;
          font-size: 0.68rem; font-weight: 700; color: #161619;
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          z-index: 2;
        }
        .ms-company-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #1429D0; flex-shrink: 0;
        }

        /* ── Card body ── */
        .ms-body {
          padding: 1.1rem 1.25rem 1.25rem;
          display: flex; flex-direction: column; flex: 1;
        }

        .ms-name {
          font-size: 1rem; font-weight: 800; color: #161619;
          margin-bottom: 0.15rem; letter-spacing: -0.01em;
        }
        .ms-role {
          font-size: 0.77rem; color: #6B7280; font-weight: 500;
          margin-bottom: 0.85rem;
        }

        /* Info row */
        .ms-info-row {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.78rem; font-weight: 600; color: #36383e;
          margin-bottom: 0.4rem;
        }
        .ms-info-row svg { color: #1429D0; flex-shrink: 0; }

        /* Divider */
        .ms-divider {
          height: 1px; background: rgba(20,41,208,0.07);
          margin: 0.9rem 0;
        }

        /* Skills */
        .ms-skills {
          display: flex; flex-wrap: wrap; gap: 0.4rem;
          margin-bottom: auto;
        }
        .ms-skill {
          font-size: 0.69rem; font-weight: 700;
          padding: 0.22rem 0.6rem; border-radius: 6px;
          background: #EEF2FF;
          color: #1429D0;
          border: 1px solid rgba(20,41,208,0.12);
          transition: all 0.16s;
        }
        .ms-skill:hover {
          background: #1429D0; color: #fff;
          border-color: #1429D0;
        }

        /* Profile CTA */
        .ms-cta {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 1rem;
          padding-top: 0.85rem;
          border-top: 1px solid rgba(20,41,208,0.07);
        }
        .ms-cta-text {
          font-size: 0.75rem; font-weight: 700; color: #1429D0;
          display: flex; align-items: center; gap: 0.3rem;
          cursor: pointer; transition: gap 0.2s;
        }
        .ms-cta-text:hover { gap: 0.5rem; }

        /* Rating stars */
        .ms-rating {
          display: flex; align-items: center; gap: 0.25rem;
          font-size: 0.72rem; font-weight: 700; color: #F59E0B;
        }
        .ms-rating svg { flex-shrink: 0; }

        /* ── Bottom strip ── */
        .ms-strip {
          margin-top: 3rem;
          display: flex; align-items: center; justify-content: center;
          gap: 1.5rem; flex-wrap: wrap;
          text-align: center;
        }
        .ms-strip-stat {
          display: flex; flex-direction: column; align-items: center;
          padding: 1rem 2rem;
          background: #fff;
          border: 1px solid rgba(20,41,208,0.1);
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(20,41,208,0.05);
          transition: all 0.22s;
        }
        .ms-strip-stat:hover {
          border-color: rgba(20,41,208,0.22);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(20,41,208,0.09);
        }
        .ms-strip-num {
          font-size: 1.5rem; font-weight: 900; color: #1429D0;
          letter-spacing: -0.03em; line-height: 1;
        }
        .ms-strip-lbl {
          font-size: 0.7rem; font-weight: 600; color: #9CA3AF;
          text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px;
        }
        .ms-strip-divider {
          width: 1px; height: 40px; background: rgba(20,41,208,0.12);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .ms-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .ms-grid { grid-template-columns: 1fr; }
          .ms { padding: 4rem 4%; }
          .ms-strip-divider { display: none; }
        }
      `}</style>

      <section className="ms"  id="mentors">
        <div className="ms-bg" />
        <div className="ms-dots" />

        <div className="ms-inner">

          {/* ── Header ── */}
          <div className="ms-header">
            <div className="ms-label">
              <span className="ms-label-dot" />
              Learn From The Best
            </div>
            <h2 className="ms-h2">
              Meet Your <em>Mentors</em>
            </h2>
            <p className="ms-desc">
              Industry veterans from top companies who share real-world
              experience and practical insights that textbooks can't teach.
            </p>
          </div>

          {/* ── Grid ── */}
          <div className="ms-grid">
            {mentorsData.slice(0, 4).map((mentor) => (
              <div key={mentor.id} className="ms-card">

                {/* Accent bar */}
                <div
                  className="ms-accent-bar"
                  style={{ background: `linear-gradient(90deg, ${mentor.accentColor}, #0E7FDD)` }}
                />

                {/* Image */}
                <div className="ms-img-wrap">
                  <img src={mentor.image} alt={mentor.name} className="ms-img" />
                  {/* Company badge on image */}
                  <div className="ms-company-badge">
                    <span className="ms-company-dot" />
                    {mentor.company}
                  </div>
                </div>

                {/* Body */}
                <div className="ms-body">
                  <div className="ms-name">{mentor.name}</div>
                  <div className="ms-role">{mentor.role}</div>

                  <div className="ms-info-row">
                    <Clock size={12} />
                    <span>{mentor.years} experience</span>
                  </div>

                  <div className="ms-divider" />

                  <div className="ms-skills">
                    {mentor.skills.map((skill, i) => (
                      <span key={i} className="ms-skill">{skill}</span>
                    ))}
                  </div>

                  <div className="ms-cta">
                    <span className="ms-cta-text">
                      View Profile <ArrowRight size={12} />
                    </span>
                    <div className="ms-rating">
                      <Star size={11} fill="#F59E0B" stroke="none" />
                      4.9
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* ── Stats strip ── */}
          {/* <div className="ms-strip">
            {[
              { n: "50+",  lbl: "Expert Mentors"    },
              { n: "8+",   lbl: "Avg. Years Exp."   },
              { n: "FAANG",lbl: "Top Companies"     },
              { n: "4.9★", lbl: "Mentor Rating"     },
              { n: "1:1",  lbl: "Sessions Offered"  },
            ].map((s, i, arr) => (
              <>
                <div key={s.lbl} className="ms-strip-stat">
                  <div className="ms-strip-num">{s.n}</div>
                  <div className="ms-strip-lbl">{s.lbl}</div>
                </div>
                {i < arr.length - 1 && <div key={`d-${i}`} className="ms-strip-divider" />}
              </>
            ))}
          </div> */}

        </div>
      </section>
    </>
  );
}