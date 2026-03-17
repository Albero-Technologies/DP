import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2 } from 'lucide-react';

const faqs = [
  {
    q: 'What are the eligibility criteria for the programs?',
    a: 'Our programs are open to graduates and working professionals from any background. Basic computer knowledge and English proficiency are required. No prior coding experience is needed for beginner programs.',
    tag: 'Admissions',
  },
  {
    q: 'What is the duration of the programs?',
    a: 'Program duration varies from 4 to 8 months depending on the course you choose. All programs include flexible schedules with weekend and evening batches available.',
    tag: 'Curriculum',
  },
  {
    q: 'Do you provide placement assistance?',
    a: 'Yes! We offer 360° placement support including resume building, mock interviews, portfolio development, and direct connections with 500+ hiring partners. Our placement rate is 95%.',
    tag: 'Placement',
  },
  {
    q: 'What is the fee structure and payment options?',
    a: 'We offer flexible payment plans including EMI options, income-share agreements, and scholarships for deserving candidates. Contact our counselors for detailed fee information.',
    tag: 'Fees',
  },
  {
    q: 'Can I switch careers with no technical background?',
    a: 'Absolutely! Many of our successful alumni come from non-technical backgrounds. Our programs are designed to take you from basics to industry-ready skills with personalized support.',
    tag: 'Careers',
  },
  {
    q: 'What kind of projects will I work on?',
    a: "You'll work on real-world capstone projects in areas like predictive analytics, ML models, data pipelines, and business intelligence dashboards. Projects are based on actual industry scenarios.",
    tag: 'Projects',
  },
  {
    q: 'Who are the mentors and what is their industry experience?',
    a: 'Our mentors are senior professionals with 8–20 years of experience from companies like Google, JPMorgan, Flipkart, and McKinsey. Each student is paired with a dedicated mentor based on their career goals and program track — not just assigned randomly.',
    tag: 'Mentorship',
  },
  {
    q: 'Will I receive a certificate upon completion?',
    a: 'Yes. You receive a globally recognised DataPreneur completion certificate along with co-branded certificates from our Microsoft and NASSCOM partnerships. All certificates are digitally verifiable and widely recognised by hiring managers at top firms.',
    tag: 'Certificate',
  },
  {
    q: 'What tools and technologies will I learn?',
    a: 'Depending on your program, you will gain hands-on experience with Python, SQL, Power BI, Tableau, Excel, machine learning libraries (scikit-learn, TensorFlow), cloud platforms (AWS, Azure), and industry-standard data pipeline tools like Apache Spark and dbt.',
    tag: 'Curriculum',
  },
  {
    q: 'What salary can I expect after completing the program?',
    a: 'Our alumni have secured roles ranging from ₹6 LPA for freshers to ₹22 LPA for experienced professionals making a domain switch. The median first-year salary across all 2024 placements was ₹9.4 LPA, with top performers landing at FAANG-tier companies.',
    tag: 'Careers',
  },
  {
    q: 'How are live classes structured and what if I miss one?',
    a: 'Live sessions run 3–4 times per week in the evenings (7–9 PM IST) and on weekends. Every session is recorded and available in your personal dashboard within 24 hours — so you never fall behind regardless of your schedule or time zone.',
    tag: 'Curriculum',
  },
  {
    q: 'Is there a refund or cancellation policy?',
    a: 'Yes. We offer a full refund within 7 days of the program start date, no questions asked. After 7 days, a pro-rated refund is available up to 30 days. We strongly encourage attending the free demo class before enrolling to make sure the program is the right fit for you.',
    tag: 'Fees',
  },
];

const highlights = [
  { title: 'Expert Guidance',    text: '1-on-1 career counseling sessions' },
  { title: '360° Support',       text: 'Resume, interviews, placement'      },
  { title: 'Flexible Learning',  text: 'Weekend and evening batches'        },
  { title: '95% Placement Rate', text: 'Proven success with alumni'         },
];

const tagColors = {
  Admissions:  { bg: 'rgba(20,41,208,0.08)',  color: '#1429D0' },
  Curriculum:  { bg: 'rgba(14,127,221,0.09)', color: '#0E7FDD' },
  Placement:   { bg: 'rgba(5,150,105,0.09)',  color: '#059669' },
  Fees:        { bg: 'rgba(245,158,11,0.10)', color: '#B45309' },
  Careers:     { bg: 'rgba(139,92,246,0.09)', color: '#7C3AED' },
  Projects:    { bg: 'rgba(236,72,153,0.09)', color: '#BE185D' },
  Mentorship:  { bg: 'rgba(20,184,166,0.09)', color: '#0D9488' },
  Certificate: { bg: 'rgba(234,179,8,0.09)',  color: '#A16207' },
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(f => f.tag)))];
  const filteredFaqs = activeCategory === 'All' ? faqs : faqs.filter(f => f.tag === activeCategory);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        .faq * { box-sizing: border-box; }

        .faq {
          padding: 4.5rem 5%;
          background: #ffffff;
          overflow: hidden;
          position: relative;
          font-family: 'DM Sans', sans-serif;
        }

        .faq-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 45% 55% at 0% 30%,  rgba(20,41,208,0.05) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 100% 75%, rgba(14,127,221,0.04) 0%, transparent 65%);
        }
        .faq-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(20,41,208,0.05) 1px, transparent 1px);
          background-size: 26px 26px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 100%);
        }

        .faq-inner {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto;
        }

        /* ── Full-width header ── */
        .faq-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 2.5rem;
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(20,41,208,0.08);
        }
        .faq-header-left { max-width: 580px; }

        .faq-label {
          display: inline-flex; align-items: center; gap: 0.45rem;
          background: rgba(20,41,208,0.07);
          border: 1px solid rgba(20,41,208,0.15);
          border-radius: 99px;
          padding: 0.25rem 0.8rem 0.25rem 0.55rem;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; color: #1429D0;
          margin-bottom: 1.1rem;
        }
        .faq-label-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #1429D0;
          animation: faq-blink 2s ease-in-out infinite;
        }
        @keyframes faq-blink { 0%,100%{opacity:1} 50%{opacity:.3} }

        .faq-h2 {
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 900; line-height: 1.08;
          letter-spacing: -0.035em; color: #161619; margin: 0 0 0.8rem;
        }
        .faq-h2 em { font-style: normal; color: #1429D0; }
        .faq-desc { font-size: 0.97rem; color: #6B7280; line-height: 1.75; margin: 0; }

        /* ── CHANGED: Stats now in a row ── */
        .faq-header-stats {
          display: flex;
          flex-direction: row;
          gap: 0.75rem;
          align-self: center;
          flex-shrink: 0;
        }
        .faq-hstat {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.85rem 1.25rem;
          background: #F5F7FA; border: 1px solid rgba(20,41,208,0.1);
          border-radius: 14px; min-width: 160px;
        }
        .faq-hstat-num { font-size: 1.4rem; font-weight: 900; color: #1429D0; letter-spacing: -0.03em; line-height: 1; flex-shrink: 0; }
        .faq-hstat-lbl { font-size: 0.72rem; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; }

        /* ── Body ── */
        .faq-body {
          display: grid;
          grid-template-columns: 1fr 1.35fr;
          gap: 3.5rem;
          align-items: start;
        }

        /* ── Left sidebar ── */
        .faq-left { display: flex; flex-direction: column; gap: 1rem; }

        .faq-hl-card {
          background: #F5F7FA; border: 1px solid rgba(20,41,208,0.09);
          border-radius: 20px; padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(20,41,208,0.04);
        }
        .faq-hl-title {
          font-size: 0.7rem; font-weight: 700; color: #1429D0;
          text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 1rem;
        }
        .faq-hl-list { display: flex; flex-direction: column; gap: 0.65rem; }
        .faq-hl-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 0.9rem; border-radius: 12px; background: #fff;
          border: 1px solid rgba(20,41,208,0.08);
          transition: all 0.2s; cursor: default;
        }
        .faq-hl-item:hover {
          border-color: rgba(20,41,208,0.22);
          box-shadow: 0 4px 14px rgba(20,41,208,0.08);
          transform: translateX(3px);
        }
        .faq-hl-icon {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          background: linear-gradient(135deg, #1429D0, #0E7FDD);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 10px rgba(20,41,208,0.22);
        }
        .faq-hl-name { font-size: 0.86rem; font-weight: 700; color: #161619; }
        .faq-hl-sub  { font-size: 0.75rem; color: #6B7280; }

        .faq-cta-block {
          background: linear-gradient(135deg, #1429D0 0%, #0E7FDD 100%);
          border-radius: 18px; padding: 1.5rem; color: #fff;
          position: relative; overflow: hidden;
        }
        .faq-cta-block::before {
          content: ''; position: absolute; top: -40px; right: -40px;
          width: 120px; height: 120px; border-radius: 50%;
          background: rgba(255,255,255,0.08); pointer-events: none;
        }
        .faq-cta-heading { font-size: 0.95rem; font-weight: 800; margin-bottom: 0.35rem; }
        .faq-cta-text    { font-size: 0.78rem; opacity: 0.8; line-height: 1.55; margin-bottom: 1rem; }
        .faq-cta-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: #fff; color: #1429D0; border: none; border-radius: 9px;
          padding: 0.55rem 1.1rem; font-size: 0.8rem; font-weight: 700;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.18s;
        }
        .faq-cta-btn:hover {
          background: #F2F5FF; box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          transform: translateY(-1px);
        }

        /* ── Filter tabs ── */
        .faq-filters {
          display: flex; flex-wrap: wrap; gap: 0.55rem;
          margin-bottom: 1.1rem;
        }
        .faq-filter-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.45rem 1rem; border-radius: 99px;
          font-size: 0.78rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: 1.5px solid rgba(20,41,208,0.13);
          background: #F5F7FA; color: #6B7280;
          cursor: pointer; transition: all 0.18s ease;
          white-space: nowrap;
        }
        .faq-filter-btn:hover:not(.active) {
          border-color: rgba(20,41,208,0.3);
          color: #1429D0; background: #fff;
        }
        .faq-filter-btn.active {
          background: #1429D0; color: #fff;
          border-color: #1429D0;
          box-shadow: 0 4px 14px rgba(20,41,208,0.25);
        }
        .faq-filter-count {
          display: inline-flex; align-items: center; justify-content: center;
          width: 20px; height: 20px; border-radius: 50%;
          font-size: 0.68rem; font-weight: 700; line-height: 1;
          background: rgba(255,255,255,0.25); color: inherit;
        }
        .faq-filter-btn:not(.active) .faq-filter-count {
          background: rgba(20,41,208,0.1); color: #1429D0;
        }

        /* ── Accordion ── */
        .faq-right { display: flex; flex-direction: column; gap: 0; }

        /* ── CHANGED: Scrollable accordion list — 5 items visible ── */
        .faq-scroll-list {
          height: 490px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-right: 0.5rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(20,41,208,0.35) rgba(20,41,208,0.07);
        }
        .faq-scroll-list::-webkit-scrollbar {
          width: 6px;
        }
        .faq-scroll-list::-webkit-scrollbar-track {
          background: rgba(20,41,208,0.07);
          border-radius: 99px;
        }
        .faq-scroll-list::-webkit-scrollbar-thumb {
          background: rgba(20,41,208,0.35);
          border-radius: 99px;
        }
        .faq-scroll-list::-webkit-scrollbar-thumb:hover {
          background: rgba(20,41,208,0.55);
        }

        .faq-item {
          background: #F5F7FA; border: 1.5px solid rgba(20,41,208,0.09);
          border-radius: 16px; overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          cursor: pointer;
          flex-shrink: 0;
        }
        .faq-item.open {
          background: #fff; border-color: #1429D0;
          box-shadow: 0 8px 32px rgba(20,41,208,0.10);
        }
        .faq-item:not(.open):hover {
          border-color: rgba(20,41,208,0.25); background: #fff;
        }

        .faq-q-row {
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem; padding: 1.1rem 1.25rem;
        }
        .faq-q-left { display: flex; align-items: center; gap: 0.75rem; min-width: 0; }

        .faq-tag {
          flex-shrink: 0; font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.05em; padding: 0.18rem 0.55rem;
          border-radius: 99px; text-transform: uppercase; white-space: nowrap;
        }
        .faq-q-text {
          font-size: 0.93rem; font-weight: 600; color: #161619;
          line-height: 1.45; margin: 0; transition: color 0.2s;
        }
        .faq-item.open .faq-q-text { color: #1429D0; }

        .faq-chevron-wrap {
          width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(20,41,208,0.07); color: #1429D0;
          transition: background 0.22s;
        }
        .faq-item.open .faq-chevron-wrap { background: #1429D0; color: #fff; }

        .faq-answer {
          font-size: 0.86rem; color: #6B7280; line-height: 1.75; margin: 0;
          padding: 0.9rem 1.25rem 1.1rem;
          border-top: 1px solid rgba(20,41,208,0.07);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .faq-body { grid-template-columns: 1fr; gap: 2.5rem; }
          .faq-header { grid-template-columns: 1fr; gap: 1.5rem; }
          .faq-header-stats { flex-direction: row; flex-wrap: wrap; width: 100%; }
          .faq-hstat { min-width: 0; flex: 1; }
        }
        @media (max-width: 600px) {
          .faq { padding: 4.5rem 4%; }
          .faq-header-stats { gap: 0.75rem; flex-wrap: wrap; }
          .faq-hstat { padding: 0.75rem 1rem; }
          .faq-hstat-num { font-size: 1.3rem; }
          .faq-scroll-list { height: 420px; }
        }
      `}</style>

      <section id="faq" className="faq">
        <div className="faq-bg" />
        <div className="faq-dots" />

        <div className="faq-inner">

          {/* ── Header ── */}
          <motion.div
            className="faq-header"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="faq-header-left">
              <div className="faq-label">
                <span className="faq-label-dot" />
                FAQ
              </div>
              <h2 className="faq-h2">
                Have Questions?<br />
                <em>We Have Answers.</em>
              </h2>
              <p className="faq-desc">
                Everything you need to know about programs, eligibility, placement
                support, and career guidance — answered clearly.
              </p>
            </div>

            {/* Stats in a row */}
            <div className="faq-header-stats">
              {[
                { n: '12+',  lbl: 'Topics Covered' },
                { n: '95%',  lbl: 'Placement Rate'  },
                { n: '500+', lbl: 'Hiring Partners' },
              ].map(s => (
                <div key={s.lbl} className="faq-hstat">
                  <div className="faq-hstat-num">{s.n}</div>
                  <div className="faq-hstat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Body ── */}
          <div className="faq-body">

            {/* Left sidebar */}
            <motion.div
              className="faq-left"
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="faq-hl-card">
                <div className="faq-hl-title">Why DataPreneur</div>
                <div className="faq-hl-list">
                  {highlights.map((h, i) => (
                    <div key={i} className="faq-hl-item">
                      <div className="faq-hl-icon">
                        <CheckCircle2 size={16} color="#fff" />
                      </div>
                      <div>
                        <div className="faq-hl-name">{h.title}</div>
                        <div className="faq-hl-sub">{h.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="faq-cta-block">
                <div className="faq-cta-heading">Still have questions?</div>
                <div className="faq-cta-text">
                  Our expert counselors are available for a free 1-on-1 session to
                  help you choose the right program.
                </div>
                <button className="faq-cta-btn">
                  Book a Free Session →
                </button>
              </div>
            </motion.div>

            {/* Accordion */}
            <div className="faq-right">

              {/* Filter tabs */}
              <div className="faq-filters">
                {categories.map(cat => {
                  const count = cat === 'All' ? faqs.length : faqs.filter(f => f.tag === cat).length;
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      className={`faq-filter-btn${isActive ? ' active' : ''}`}
                      onClick={() => { setActiveCategory(cat); setOpenIndex(-1); }}
                    >
                      {cat}
                      <span className="faq-filter-count">{count}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="faq-scroll-list"
                >
                  {filteredFaqs.map((faq, i) => {
                    const globalIdx = faqs.indexOf(faq);
                    const isOpen = openIndex === globalIdx;
                    const tc = tagColors[faq.tag] || tagColors.Admissions;
                    return (
                      <div
                        key={globalIdx}
                        className={`faq-item${isOpen ? ' open' : ''}`}
                        onClick={() => setOpenIndex(isOpen ? -1 : globalIdx)}
                      >
                        <div className="faq-q-row">
                          <div className="faq-q-left">
                            <span className="faq-tag" style={{ background: tc.bg, color: tc.color }}>
                              {faq.tag}
                            </span>
                            <p className="faq-q-text">{faq.q}</p>
                          </div>
                          <motion.div
                            className="faq-chevron-wrap"
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.28, ease: 'easeInOut' }}
                          >
                            <ChevronDown size={15} />
                          </motion.div>
                        </div>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: 'easeInOut' }}
                              style={{ overflow: 'hidden' }}
                            >
                              <p className="faq-answer">{faq.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}