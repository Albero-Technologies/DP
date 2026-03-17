import { useState } from "react";
import { Play, TrendingUp, Star, Quote } from "lucide-react";
import story1 from "../../assets/mentor1.jpg";
import story2 from "../../assets/mentor2.jpg";
import story3 from "../../assets/mentor3.jpg";
import story4 from "../../assets/mentor4.jpg";
import story5 from "../../assets/mentor5.jpg";

const storiesData = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Data Scientist at Google",
    image: story1,
    hike: "300%",
    beforeLPA: "4.5",
    afterLPA: "18",
    testimonial: "Datapreneur transformed my career completely. The mentorship and real projects made all the difference.",
    company: "Google",
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "ML Engineer at Microsoft",
    image: story2,
    hike: "340%",
    beforeLPA: "5",
    afterLPA: "22",
    testimonial: "The placement support was incredible. From resume building to mock interviews, everything was top-notch.",
    company: "Microsoft",
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Data Analyst at Amazon",
    image: story3,
    hike: "240%",
    beforeLPA: "3.5",
    afterLPA: "12",
    testimonial: "The curriculum was perfectly aligned with industry needs. I felt confident from day one at my new job.",
    company: "Amazon",
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Senior BI Developer at Accenture",
    image: story4,
    hike: "280%",
    beforeLPA: "4",
    afterLPA: "15",
    testimonial: "The hands-on projects and mentorship helped me secure a senior role. Best investment in my career.",
    company: "Accenture",
  },
  {
    id: 5,
    name: "Neha Kapoor",
    role: "Data Scientist at IBM",
    image: story5,
    hike: "320%",
    beforeLPA: "3.8",
    afterLPA: "16",
    testimonial: "Outstanding support throughout the journey. The community and guidance made all the difference.",
    company: "IBM",
  },
];

function StoryCard({ story }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      className="ss-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        transform: hov ? "translateY(-8px)" : "none",
        boxShadow: hov
          ? "0 24px 56px rgba(20,41,208,0.16), 0 2px 8px rgba(0,0,0,0.06)"
          : "0 4px 20px rgba(20,41,208,0.08)",
        borderColor: hov ? "rgba(20,41,208,0.22)" : "rgba(20,41,208,0.09)",
      }}
    >
      {/* ── Image block ── */}
      <div className="ss-img-wrap">
        <img src={story.image} alt={story.name} className="ss-img" />

        {/* Dark gradient */}
        <div className="ss-img-overlay" />

        {/* Hike badge — top left */}
        <div className="ss-hike-badge">
          <TrendingUp size={12} color="#BFD2FF" />
          {story.hike} Hike
        </div>

        {/* Play button */}
        {/* <div
          className="ss-play"
          style={{
            background: hov ? "#1429D0" : "rgba(20,41,208,0.82)",
            transform: hov
              ? "translate(-50%,-50%) scale(1.12)"
              : "translate(-50%,-50%) scale(1)",
          }}
        >
          <Play size={18} color="#fff" fill="#fff" />
        </div> */}

        {/* Name overlay at bottom */}
        <div className="ss-img-name-wrap">
          <div className="ss-img-name">{story.name}</div>
          <div className="ss-img-role">{story.role}</div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="ss-body">

        {/* LPA transformation */}
        <div className="ss-lpa-row">
          <div className="ss-lpa-block">
            <div className="ss-lpa-label">Before</div>
            <div className="ss-lpa-val ss-lpa-before">₹{story.beforeLPA} LPA</div>
          </div>

          <div className="ss-arrow-circle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>

          <div className="ss-lpa-block">
            <div className="ss-lpa-label">After</div>
            <div className="ss-lpa-val ss-lpa-after">₹{story.afterLPA} LPA</div>
          </div>
        </div>

        {/* Divider */}
        <div className="ss-divider" />

        {/* Testimonial */}
        <div className="ss-testimonial">
          <Quote size={16} className="ss-quote-icon" />
          <p className="ss-quote-text">{story.testimonial}</p>
        </div>

        {/* Footer */}
        <div className="ss-footer">
          <div className="ss-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill="#F59E0B" stroke="none" />
            ))}
          </div>
          <div className="ss-company-tag">{story.company}</div>
        </div>

      </div>
    </div>
  );
}

export default function SuccessStoriesSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        .ss-section * { box-sizing: border-box; }

        .ss-section {
          padding: 4.5rem 0;
          background: #F5F7FA;
          overflow: hidden;
          position: relative;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Background ── */
        .ss-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 50% 50% at 5%  15%, rgba(20,41,208,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 95% 85%, rgba(14,127,221,0.05) 0%, transparent 60%);
        }
        .ss-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(20,41,208,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 10%, transparent 100%);
        }

        /* ── Header ── */
        .ss-header {
          text-align: center;
          margin-bottom: 3.5rem;
          padding: 0 5%;
          position: relative; z-index: 1;
        }

        .ss-label {
          display: inline-flex; align-items: center; gap: 0.45rem;
          background: rgba(20,41,208,0.07);
          border: 1px solid rgba(20,41,208,0.15);
          border-radius: 99px;
          padding: 0.27rem 0.9rem 0.27rem 0.6rem;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; color: #1429D0;
          margin-bottom: 1.1rem;
        }
        .ss-label-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #1429D0;
          animation: ss-blink 2s ease-in-out infinite;
        }
        @keyframes ss-blink { 0%,100%{opacity:1} 50%{opacity:.3} }

        .ss-h2 {
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 900; color: #161619;
          margin-bottom: 0.85rem;
          letter-spacing: -0.03em; line-height: 1.1;
        }
        .ss-h2 em {
          font-style: normal;
          background: linear-gradient(130deg, #1429D0 0%, #0E7FDD 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ss-desc {
          font-size: 1rem; color: #6B7280;
          max-width: 500px; margin: 0 auto; line-height: 1.75;
        }

        /* ── Stats row under header ── */
        .ss-stats {
          display: flex; align-items: center; justify-content: center;
          gap: 2.5rem; margin-top: 1.75rem; flex-wrap: wrap;
        }
        .ss-stat-item {
          text-align: center;
        }
        .ss-stat-num {
          font-size: 1.5rem; font-weight: 900; color: #1429D0;
          letter-spacing: -0.03em; line-height: 1;
        }
        .ss-stat-lbl {
          font-size: 0.68rem; font-weight: 600; color: #9CA3AF;
          text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px;
        }
        .ss-stat-sep {
          width: 1px; height: 32px; background: rgba(20,41,208,0.12);
        }

        /* ── Scroll track ── */
        .ss-scroll-wrap {
          position: relative; overflow: hidden;
        }
        .ss-scroll-track {
          display: flex;
          gap: 1.25rem;
          width: fit-content;
          padding: 1rem 0 1.5rem;
          padding-left: 1.5rem;
          animation: ss-scroll 42s linear infinite;
          will-change: transform;
        }
        .ss-scroll-wrap:hover .ss-scroll-track {
          animation-play-state: paused;
        }
        @keyframes ss-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Edge fades */
        .ss-fade-l {
          position: absolute; left: 0; top: 0; bottom: 0; width: 140px;
          background: linear-gradient(90deg, #F5F7FA 30%, transparent);
          pointer-events: none; z-index: 10;
        }
        .ss-fade-r {
          position: absolute; right: 0; top: 0; bottom: 0; width: 140px;
          background: linear-gradient(270deg, #F5F7FA 30%, transparent);
          pointer-events: none; z-index: 10;
        }

        /* ── Card ── */
        .ss-card {
          flex: 0 0 288px;
          background: #fff;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(20,41,208,0.09);
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
          cursor: pointer;
          display: flex; flex-direction: column;
        }

        /* ── Image ── */
        .ss-img-wrap {
          position: relative; width: 100%; height: 195px; flex-shrink: 0;
          overflow: hidden;
        }
        .ss-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: top;
          display: block;
          transition: transform 0.4s ease;
        }
        .ss-card:hover .ss-img { transform: scale(1.05); }

        .ss-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 35%, rgba(22,22,25,0.65) 100%);
        }

        /* Hike badge */
        .ss-hike-badge {
          position: absolute; top: 12px; left: 12px;
          display: inline-flex; align-items: center; gap: 5px;
          background: linear-gradient(135deg, #1429D0, #0E7FDD);
          color: #fff; padding: 4px 11px; border-radius: 99px;
          font-size: 0.71rem; font-weight: 700;
          box-shadow: 0 4px 12px rgba(20,41,208,0.35);
        }

        /* Play button */
        // .ss-play {
        //   position: absolute; top: 50%; left: 50%;
        //   width: 48px; height: 48px; border-radius: 50%;
        //   display: flex; align-items: center; justify-content: center;
        //   box-shadow: 0 4px 18px rgba(20,41,208,0.45);
        //   transition: all 0.25s ease;
        // }

        /* Name overlay */
        .ss-img-name-wrap {
          position: absolute; bottom: 10px; left: 14px; right: 14px; z-index: 2;
        }
        .ss-img-name {
          font-size: 0.95rem; font-weight: 800; color: #fff;
          letter-spacing: -0.01em; line-height: 1.2;
        }
        .ss-img-role {
          font-size: 0.71rem; color: rgba(255,255,255,0.75); font-weight: 500;
          margin-top: 2px;
        }

        /* ── Body ── */
        .ss-body {
          padding: 1.1rem 1.2rem 1.2rem;
          display: flex; flex-direction: column; flex: 1;
        }

        /* LPA row */
        .ss-lpa-row {
          display: flex; align-items: center; gap: 0;
          background: #F2F5FF;
          border: 1px solid rgba(20,41,208,0.09);
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 0.85rem;
        }
        .ss-lpa-block {
          flex: 1; text-align: center; padding: 0.7rem 0.5rem;
        }
        .ss-lpa-label {
          font-size: 0.6rem; font-weight: 700; color: #9CA3AF;
          text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 3px;
        }
        .ss-lpa-val {
          font-size: 0.9rem; font-weight: 800;
        }
        .ss-lpa-before { color: #374151; }
        .ss-lpa-after  { color: #1429D0; }

        .ss-arrow-circle {
          width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #1429D0, #0E7FDD);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 10px rgba(20,41,208,0.3);
          margin: 0 0.15rem;
        }

        /* Divider */
        .ss-divider {
          height: 1px; background: rgba(20,41,208,0.07); margin-bottom: 0.8rem;
        }

        /* Testimonial */
        .ss-testimonial {
          display: flex; gap: 0.6rem; align-items: flex-start;
          margin-bottom: 0.85rem; flex: 1;
        }
        .ss-quote-icon {
          color: #BFD2FF; flex-shrink: 0; margin-top: 2px;
        }
        .ss-quote-text {
          font-size: 0.78rem; color: #374151;
          line-height: 1.65; margin: 0; font-style: italic;
        }

        /* Footer */
        .ss-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(20,41,208,0.07);
        }
        .ss-stars { display: flex; gap: 2px; }
        .ss-company-tag {
          font-size: 0.68rem; font-weight: 700; color: #1429D0;
          background: rgba(20,41,208,0.07);
          border: 1px solid rgba(20,41,208,0.14);
          border-radius: 6px; padding: 0.2rem 0.55rem;
        }

        @media (max-width: 600px) {
          .ss-section { padding: 4.5rem 0; }
          .ss-stat-sep { display: none; }
        }
      `}</style>

      <section className="ss-section">
        <div className="ss-bg" />
        <div className="ss-dots" />

        {/* ── Header ── */}
        <div className="ss-header">
          <div className="ss-label">
            <span className="ss-label-dot" />
            Alumni Wins
          </div>
          <h2 className="ss-h2">
            Real <em>Success Stories</em>
          </h2>
          <p className="ss-desc">
            Real salary transformations from our alumni — from learners to industry leaders.
          </p>

          {/* Quick stats */}
          {/* <div className="ss-stats">
            {[
              { n: "2,400+", lbl: "Placed Alumni"   },
              { n: "94%",    lbl: "Placement Rate"  },
              { n: "₹9.4L",  lbl: "Median Package"  },
              { n: "300%+",  lbl: "Avg. Salary Hike"},
            ].map((s, i, arr) => (
              <>
                <div key={s.lbl} className="ss-stat-item">
                  <div className="ss-stat-num">{s.n}</div>
                  <div className="ss-stat-lbl">{s.lbl}</div>
                </div>
                {i < arr.length - 1 && <div key={`sep-${i}`} className="ss-stat-sep" />}
              </>
            ))}
          </div> */}
        </div>

        {/* ── Scroll strip ── */}
        <div className="ss-scroll-wrap">
          <div className="ss-fade-l" />
          <div className="ss-fade-r" />

          <div className="ss-scroll-track">
            {storiesData.map(story => (
              <StoryCard key={`a-${story.id}`} story={story} />
            ))}
            {storiesData.map(story => (
              <StoryCard key={`b-${story.id}`} story={story} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}