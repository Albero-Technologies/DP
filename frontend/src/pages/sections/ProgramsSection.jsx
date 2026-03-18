import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Users, Clock, Star } from "lucide-react";
import {
  FaPython, FaDatabase, FaFire, FaSearch, FaHdd, FaLink, FaBrain
} from 'react-icons/fa';
import { FiCloud, FiGrid, FiBox, FiCpu, FiBarChart2, FiActivity } from 'react-icons/fi';

const programsData = [
  {
    title: "Data Analytics",
    slug: "data-analytics",
    badge: "Data Tools & Visualization",
    heading: "Data Analytics",
    tagline: "Launch your analytics career in just 6 months",
    description: "Master Excel, SQL, Python, Tableau, and Power BI by solving real business problems. Walk out with a portfolio that proves you can deliver insights, not just run queries.",
    tools: [
      { name: "Python", icon: <FaPython /> },
      { name: "SQL", icon: <FaDatabase /> },
      { name: "Tableau", icon: <FiBarChart2 /> },
      { name: "Power BI", icon: <FiActivity /> },
      { name: "Excel", icon: <FiGrid /> },
    ],
    meta: { duration: "6 months", students: "1,200+", rating: "4.9" },
    level: "Beginner to Advanced",
    popular: true,
    wash: "linear-gradient(105deg, rgba(20,41,208,0.08) 0%, rgba(20,41,208,0.14) 100%)",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=75",
    imgPosition: "center center",
  },
  {
    title: "Business Analytics",
    slug: "business-analytics",
    badge: "Business Intelligence",
    heading: "Business Analytics",
    tagline: "Transform data into business value",
    description: "Learn data-driven decision making, KPI frameworks, and business strategy with analytics. Build dashboards that executives actually use to make decisions.",
    tools: [
      { name: "Excel", icon: <FiGrid /> },
      { name: "Power BI", icon: <FiActivity /> },
      { name: "SQL", icon: <FaDatabase /> },
    ],
    meta: { duration: "5 months", students: "850+", rating: "4.8" },
    level: "Beginner to Advanced",
    popular: false,
    wash: "linear-gradient(105deg, rgba(14,127,221,0.07) 0%, rgba(14,127,221,0.13) 100%)",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=75",
    imgPosition: "center center",
  },
  {
    title: "Data Science and AI",
    slug: "data-science-ai",
    badge: "AI & Machine Learning",
    heading: "Data Science and AI",
    tagline: "Master AI from fundamentals to deployment",
    description: "The complete journey — from Python fundamentals to neural networks, NLP, generative AI, and deployment on cloud platforms used by industry leaders.",
    tools: [
      { name: "TensorFlow", icon: <FiCpu /> },
      { name: "PyTorch", icon: <FaFire /> },
      { name: "Docker", icon: <FiBox /> },
      { name: "AWS", icon: <FiCloud /> },
      { name: "BERT", icon: <FaBrain /> },
    ],
    meta: { duration: "8 months", students: "620+", rating: "4.9" },
    level: "Beginner to Advanced",
    popular: false,
    wash: "linear-gradient(105deg, rgba(20,41,208,0.1) 0%, rgba(30,58,138,0.15) 100%)",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1400&q=75",
    imgPosition: "center center",
  },
  {
    title: "Agentic AI & Prompt Eng.",
    slug: "agentic-ai-prompt-engineering",
    badge: "Gen AI",
    heading: "Agentic AI & Prompt Engineering",
    tagline: "Build the future of AI automation",
    description: "Build AI agents, automation workflows, and advanced prompting systems using the latest LLM tooling. From RAG pipelines to production-grade agents.",
    tools: [
      { name: "OpenAI", icon: <FaBrain /> },
      { name: "LangChain", icon: <FaLink /> },
      { name: "RAG", icon: <FaSearch /> },
      { name: "Vector DB", icon: <FaHdd /> },
    ],
    meta: { duration: "4 months", students: "430+", rating: "4.9" },
    level: "Intermediate",
    popular: false,
    wash: "linear-gradient(105deg, rgba(14,127,221,0.08) 0%, rgba(20,41,208,0.14) 100%)",
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1400&q=75",
    imgPosition: "center center",
  },
  {
    title: "Investment Banking",
    slug: "investment-banking",
    badge: "Finance & Valuation",
    heading: "Investment Banking",
    tagline: "Master financial modeling and deals",
    description: "Master financial modeling, valuation, M&A, and deal structuring for top finance roles. Land roles at bulge-bracket banks and elite boutiques.",
    tools: [
      { name: "Excel", icon: <FiGrid /> },
      { name: "Power BI", icon: <FiActivity /> },
      { name: "SQL", icon: <FaDatabase /> },
      { name: "Python", icon: <FaPython /> },
    ],
    meta: { duration: "6 months", students: "540+", rating: "4.8" },
    level: "Beginner to Advanced",
    popular: false,
    wash: "linear-gradient(105deg, rgba(30,58,138,0.07) 0%, rgba(14,127,221,0.13) 100%)",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&q=75",
    imgPosition: "center center",
  },
];

export default function ProgramsSection() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState("forward");
  const prevIndex = useRef(0);

  const handleSelect = (index) => {
    if (index === activeIndex) return;
    setDirection(index > prevIndex.current ? "forward" : "back");
    prevIndex.current = index;
    setActiveIndex(index);
    setAnimKey(k => k + 1);
  };

  const prog = programsData[activeIndex];
  const animClass = direction === "forward" ? "anim-forward" : "anim-back";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        .prog-section {
          padding: 90px 0;
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }
        .prog-blob-tr {
          position: absolute; top: -80px; right: -60px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(20,41,208,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .prog-blob-bl {
          position: absolute; bottom: -60px; left: -40px;
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(14,127,221,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .prog-container {
          max-width: 80rem; margin: 0 auto;
          padding: 0 24px; width: 100%;
          position: relative; z-index: 1;
        }

        /* ── Header ── */
        .prog-header { margin-bottom: 48px; }
        .prog-label-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .prog-label-line { width: 22px; height: 2px; background: #1429D0; border-radius: 2px; }
        .prog-label { color: #1429D0; font-size: 0.72rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
        .prog-main-heading {
          font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 900;
          color: #161619; line-height: 1.15; letter-spacing: -0.03em;
        }
        .prog-main-heading span { color: #1429D0; }

        /* ── Card shell ── */
        .prog-card {
          display: flex;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(20,41,208,0.11);
          overflow: hidden;
          border: 1px solid rgba(20,41,208,0.09);
        }

        /* ── Sidebar ── */
        .prog-sidebar {
          width: 270px; min-width: 270px;
          background: #F2F5FF;
          border-right: 1px solid rgba(20,41,208,0.10);
          display: flex; flex-direction: column;
        }
        .prog-menu-item {
          padding: 20px 24px;
          cursor: pointer;
          transition: all 0.22s ease;
          display: flex; justify-content: space-between; align-items: center;
          border-left: 3px solid transparent;
          font-size: 0.9rem; font-weight: 500; color: #36383e;
          border-bottom: 1px solid rgba(20,41,208,0.07);
          user-select: none;
        }
        .prog-menu-item:last-child { border-bottom: none; }
        .prog-menu-item:hover:not(.active) { background: rgba(20,41,208,0.06); color: #1429D0; }
        .prog-menu-item.active {
          background: #fff; border-left-color: #1429D0;
          color: #161619; font-weight: 700;
        }
        .prog-menu-arrow { transition: color 0.22s, transform 0.22s; color: #BFD2FF; flex-shrink: 0; }
        .prog-menu-item.active .prog-menu-arrow,
        .prog-menu-item:hover:not(.active) .prog-menu-arrow { color: #1429D0; transform: translateX(4px); }

        /* ── Content wrap ── */
        .prog-content-wrap { flex: 1; position: relative; overflow: hidden; }

        /* ─── Image layer: full bleed ─── */
        .prog-bg-img {
          position: absolute; inset: 0;
          background-size: cover;
          background-repeat: no-repeat;
          filter: saturate(0.7) brightness(1.05);
          transition: opacity 0.4s ease;
        }

        /* ─── Wash ─── */
        .prog-wash {
          position: absolute; inset: 0;
          background: linear-gradient(
            100deg,
            #ffffff 0%,
            #ffffff 38%,
            rgba(255,255,255,0.85) 52%,
            rgba(255,255,255,0.30) 70%,
            rgba(255,255,255,0.05) 100%
          );
          transition: background 0.55s ease;
          pointer-events: none;
        }
        .prog-tint {
          position: absolute; inset: 0;
          background: linear-gradient(
            100deg,
            transparent 40%,
            var(--prog-tint-start) 65%,
            var(--prog-tint-end) 100%
          );
          pointer-events: none;
          transition: opacity 0.4s ease;
        }

        /* ── Content text ── */
        .prog-content {
          position: relative; z-index: 2;
          padding: 48px;
          height: 100%;
        }

        /* Animations */
        @keyframes slideFromRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideFromLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .anim-forward { animation: slideFromRight 0.4s cubic-bezier(.25,.8,.25,1) both; }
        .anim-back    { animation: slideFromLeft  0.4s cubic-bezier(.25,.8,.25,1) both; }
        .prog-r1 { animation-delay: 0.03s; }
        .prog-r2 { animation-delay: 0.09s; }
        .prog-r3 { animation-delay: 0.15s; }
        .prog-r4 { animation-delay: 0.21s; }
        .prog-r5 { animation-delay: 0.27s; }
        .prog-r6 { animation-delay: 0.33s; }

        /* ── Content elements ── */
        .prog-top-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; }
        .prog-tagline-row { display: flex; align-items: center; gap: 8px; }
        .prog-tagline { font-size: 0.88rem; color: #1429D0; font-weight: 600; margin: 0; }

        .prog-popular {
          display: flex; align-items: center; gap: 7px;
          padding: 5px 14px;
          background: rgba(20,41,208,0.08);
          border: 1px solid rgba(20,41,208,0.2);
          border-radius: 100px;
        }
        .prog-popular-dot { width: 7px; height: 7px; background: #1429D0; border-radius: 50%; animation: prog-dot-pulse 2s ease-in-out infinite; }
        @keyframes prog-dot-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        .prog-popular-text { font-size: 0.72rem; font-weight: 700; color: #1429D0; }

        .prog-content-heading {
          font-size: clamp(1.7rem, 3vw, 2.3rem); font-weight: 900;
          color: #161619; margin-bottom: 16px; letter-spacing: -0.02em;
        }

        .prog-badge-pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: #1429D0; color: #fff;
          padding: 7px 18px; border-radius: 100px;
          font-size: 0.8rem; font-weight: 700;
          margin-bottom: 20px;
          box-shadow: 0 6px 20px rgba(20,41,208,0.28);
        }

        .prog-desc {
          color: #36383e; font-size: 1rem; line-height: 1.75;
          margin-bottom: 14px; max-width: 540px;
        }

        /* Meta row */
        .prog-meta-row {
          display: flex; align-items: center; gap: 1.25rem;
          margin-bottom: 20px; flex-wrap: wrap;
        }
        .prog-meta-item {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.79rem; font-weight: 600; color: #6B7280;
        }
        .prog-meta-item svg { color: #1429D0; flex-shrink: 0; }

        .prog-tools { display: flex; flex-wrap: wrap; gap: 9px; margin-bottom: 32px; }
        .prog-tool-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 13px;
          background: rgba(255,255,255,0.88);
          border: 1.5px solid rgba(20,41,208,0.16);
          border-radius: 8px;
          font-size: 0.8rem; font-weight: 600; color: #262832;
          transition: all 0.18s;
          box-shadow: 0 1px 4px rgba(20,41,208,0.06);
          backdrop-filter: blur(6px);
        }
        .prog-tool-tag:hover {
          border-color: #1429D0; color: #1429D0;
          background: rgba(242,245,255,0.95); transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(20,41,208,0.1);
        }
        .prog-tool-icon { display: inline-flex; align-items: center; font-size: 1rem; }

        .prog-bottom-row { display: flex; justify-content: space-between; align-items: center; }
        .prog-level { font-size: 0.82rem; font-weight: 500; color: #36383e; }

        .prog-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 12px 28px; border-radius: 10px;
          border: none; background: #1429D0; color: #fff;
          font-weight: 700; font-size: 0.95rem;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.22s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 4px 20px rgba(20,41,208,0.28);
        }
        .prog-btn:hover {
          background: #0e1fb0; transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(20,41,208,0.36);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .prog-card { flex-direction: column; }
          .prog-sidebar {
            width: 100%; min-width: unset;
            flex-direction: row; overflow-x: auto;
            border-right: none; border-bottom: 1px solid rgba(20,41,208,0.10);
          }
          .prog-menu-item {
            border-left: none; border-bottom: 3px solid transparent;
            white-space: nowrap; flex-shrink: 0;
          }
          .prog-menu-item.active { border-bottom-color: #1429D0; border-left: none; }
          .prog-menu-arrow { display: none; }
          .prog-content { padding: 28px 20px; }
          .prog-bottom-row { flex-direction: column; gap: 14px; align-items: flex-start; }
          .prog-btn { width: 100%; justify-content: center; }
          /* On mobile, simpler wash */
          .prog-wash { background: rgba(255,255,255,0.92); }
          .prog-tint  { display: none; }
        }
        @media (max-width: 540px) {
          .prog-top-row { flex-direction: column; gap: 10px; }
          .prog-section { padding: 60px 0; }
        }
      `}</style>

      <section className="prog-section" id="programs">
        <div className="prog-blob-tr" />
        <div className="prog-blob-bl" />

        <div className="prog-container">

          {/* Header */}
          <div className="prog-header">
            <div className="prog-label-row">
              <span className="prog-label-line" />
              <span className="prog-label">Programs</span>
            </div>
            <h2 className="prog-main-heading">
              Choose Your Path. <span>Own Your Future.</span>
            </h2>
          </div>

          {/* Card */}
          <div className="prog-card">

            {/* Sidebar */}
            <div className="prog-sidebar">
              {programsData.map((p, i) => (
                <div
                  key={i}
                  className={`prog-menu-item${activeIndex === i ? " active" : ""}`}
                  onClick={() => handleSelect(i)}
                  onMouseEnter={() => handleSelect(i)}
                >
                  <span>{p.title}</span>
                  <ArrowRight size={15} className="prog-menu-arrow" />
                </div>
              ))}
            </div>

            {/* Content area */}
            <div className="prog-content-wrap">

              {/* 1. Full-bleed background image */}
              <div
                key={`img-${activeIndex}`}
                className="prog-bg-img"
                style={{
                  backgroundImage: `url('${prog.img}')`,
                  backgroundPosition: prog.imgPosition,
                }}
              />

              {/* 2. White-to-transparent wash (left clear, right shows image) */}
              <div className="prog-wash" />

              {/* 3. Per-program blue tint on the right half */}
              <div
                className="prog-tint"
                style={{
                  '--prog-tint-start': prog.wash.match(/rgba\([^)]+\)/g)?.[0] ?? 'rgba(20,41,208,0.10)',
                  '--prog-tint-end': prog.wash.match(/rgba\([^)]+\)/g)?.[1] ?? 'rgba(14,127,221,0.16)',
                }}
              />

              {/* 4. Animated content */}
              <div key={animKey} className="prog-content">

                <div className={`prog-top-row prog-r1 ${animClass}`}>
                  <div className="prog-tagline-row">
                    <Zap size={15} color="#1429D0" />
                    <p className="prog-tagline">{prog.tagline}</p>
                  </div>
                  {prog.popular && (
                    <div className="prog-popular">
                      <div className="prog-popular-dot" />
                      <span className="prog-popular-text">Most Popular</span>
                    </div>
                  )}
                </div>

                <h3 className={`prog-content-heading prog-r2 ${animClass}`}>
                  {prog.heading}
                </h3>

                <div className={`prog-badge-pill prog-r3 ${animClass}`}>
                  <Zap size={12} color="#fff" />
                  {prog.badge}
                </div>

                <p className={`prog-desc prog-r4 ${animClass}`}>
                  {prog.description}
                </p>

                <div className={`prog-meta-row prog-r4 ${animClass}`}>
                  <div className="prog-meta-item">
                    <Clock size={13} /> {prog.meta.duration}
                  </div>
                  <div className="prog-meta-item">
                    <Users size={13} /> {prog.meta.students} enrolled
                  </div>
                  <div className="prog-meta-item">
                    <Star size={13} /> {prog.meta.rating} rating
                  </div>
                </div>

                <div className={`prog-tools prog-r5 ${animClass}`}>
                  {prog.tools.map((tool, i) => (
                    <span key={i} className="prog-tool-tag">
                      <span className="prog-tool-icon">{tool.icon}</span>
                      {tool.name}
                    </span>
                  ))}
                </div>

                <div className={`prog-bottom-row prog-r6 ${animClass}`}>
                  <p className="prog-level">{prog.level}</p>
                  <button className="prog-btn"
                    onClick={() => navigate(`/programs/${prog.slug}`)} >
                    Discover Program <ArrowRight size={16} />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}