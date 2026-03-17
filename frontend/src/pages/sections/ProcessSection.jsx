import { useInView } from "../../hooks/useInView";
import { STEPS } from "../../data/companies";

export default function ProcessSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        .ps * { box-sizing: border-box; }

        .ps {
          padding: 4.5rem 5%;
          background: #F5F7FA;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Background ── */
        .ps-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 50% 50% at 5%  20%, rgba(20,41,208,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 95% 80%, rgba(14,127,221,0.05) 0%, transparent 60%);
        }
        .ps-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(20,41,208,0.055) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 100%);
        }

        /* ── Container ── */
        .ps-inner {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto;
        }

        /* ── Header ── */
        .ps-header { text-align: center; margin-bottom: 4.5rem; }

        .ps-label {
          display: inline-flex; align-items: center; gap: 0.45rem;
          background: rgba(20,41,208,0.07);
          border: 1px solid rgba(20,41,208,0.15);
          border-radius: 99px;
          padding: 0.27rem 0.9rem 0.27rem 0.6rem;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; color: #1429D0;
          margin-bottom: 1.25rem;
        }
        .ps-label-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #1429D0;
          animation: ps-blink 2s ease-in-out infinite;
        }
        @keyframes ps-blink { 0%,100%{opacity:1} 50%{opacity:.3} }

        .ps-h2 {
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 900; line-height: 1.08;
          letter-spacing: -0.035em; color: #161619;
          margin: 0 auto 1rem; max-width: 680px;
        }
        .ps-h2 em {
          font-style: normal;
          background: linear-gradient(130deg, #1429D0 0%, #0E7FDD 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ps-desc {
          font-size: 1rem; color: #6B7280;
          line-height: 1.75; max-width: 500px; margin: 0 auto;
        }

        /* ── Steps wrapper ── */
        .ps-steps-wrap { position: relative; }

        /* Connector line — sits behind cards */
        .ps-connector {
          position: absolute;
          top: 50px;
          left: calc(12.5% + 26px);
          right: calc(12.5% + 26px);
          height: 2px;
          pointer-events: none; z-index: 0;
          overflow: hidden;
        }
        /* Animated gradient fill */
        .ps-connector-track {
          height: 100%;
          background: linear-gradient(90deg,
            #1429D0 0%,
            #0E7FDD 50%,
            rgba(20,41,208,0.15) 100%
          );
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s;
        }
        .ps-connector-track.visible { transform: scaleX(1); }
        /* Dashed overlay on top */
        .ps-connector::after {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent 0px, transparent 8px,
            rgba(20,41,208,0.12) 8px, rgba(20,41,208,0.12) 14px
          );
        }

        /* ── Grid ── */
        .ps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          position: relative; z-index: 1;
        }

        /* ── Card ── */
        .ps-card {
          background: #fff;
          border-radius: 22px;
          padding: 2rem 1.6rem 1.75rem;
          border: 1.5px solid rgba(20,41,208,0.09);
          box-shadow: 0 4px 20px rgba(20,41,208,0.07);
          position: relative; overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          cursor: default;
        }
        .ps-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 20px 52px rgba(20,41,208,0.13);
          border-color: rgba(20,41,208,0.28);
        }

        /* Ghost number watermark */
        .ps-ghost {
          position: absolute; top: -12px; right: 4px;
          font-size: 6rem; font-weight: 900; line-height: 1;
          color: rgba(20,41,208,0.04);
          pointer-events: none; user-select: none;
          letter-spacing: -0.04em;
          transition: color 0.25s;
        }
        .ps-card:hover .ps-ghost { color: rgba(20,41,208,0.07); }

        /* Number circle */
        .ps-circle {
          width: 50px; height: 50px; border-radius: 50%;
          background: linear-gradient(135deg, #1429D0 0%, #0E7FDD 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.05rem; font-weight: 900; color: #fff;
          margin-bottom: 1.4rem;
          box-shadow: 0 6px 20px rgba(20,41,208,0.3);
          position: relative; z-index: 1; flex-shrink: 0;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .ps-card:hover .ps-circle {
          transform: scale(1.08);
          box-shadow: 0 10px 28px rgba(20,41,208,0.38);
        }

        /* Step number pill — small badge top-right */
        .ps-step-badge {
          position: absolute; top: 16px; right: 16px;
          background: rgba(20,41,208,0.07);
          border: 1px solid rgba(20,41,208,0.14);
          border-radius: 99px;
          padding: 0.18rem 0.55rem;
          font-size: 0.65rem; font-weight: 700;
          color: #1429D0; letter-spacing: 0.05em;
        }

        .ps-title {
          font-size: 1rem; font-weight: 800;
          color: #161619; margin-bottom: 0.6rem;
          letter-spacing: -0.01em; line-height: 1.2;
          position: relative; z-index: 1;
        }
        .ps-desc-text {
          font-size: 0.84rem; color: #6B7280;
          line-height: 1.65; position: relative; z-index: 1;
        }

        /* Bottom accent bar */
        .ps-card-bar {
          position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #1429D0, #0E7FDD);
          opacity: 0; transform: scaleX(0.6);
          transform-origin: left;
          transition: opacity 0.25s ease, transform 0.3s ease;
          border-radius: 0 0 22px 22px;
        }
        .ps-card:hover .ps-card-bar { opacity: 1; transform: scaleX(1); }

        /* ── Bottom CTA strip ── */
        .ps-strip {
          margin-top: 3.5rem;
          background: linear-gradient(135deg, #161619 0%, #1e2235 60%, #262832 100%);
          border-radius: 22px;
          padding: 2rem 2.5rem;
          display: flex; align-items: center; justify-content: space-between;
          gap: 2rem;
          position: relative; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 20px 56px rgba(20,41,208,0.18);
        }
        .ps-strip::before {
          content: '';
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 400px; height: 200px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(20,41,208,0.14) 0%, transparent 70%);
          pointer-events: none;
        }
        .ps-strip-orb {
          position: absolute; top: -50px; right: -50px;
          width: 180px; height: 180px; border-radius: 50%;
          background: rgba(20,41,208,0.16); pointer-events: none;
        }
        .ps-strip-left { position: relative; z-index: 1; }
        .ps-strip-heading {
          font-size: 1.15rem; font-weight: 800; color: #fff;
          letter-spacing: -0.02em; margin-bottom: 0.3rem;
        }
        .ps-strip-sub { font-size: 0.85rem; color: rgba(191,210,255,0.7); }
        .ps-strip-btn {
          position: relative; z-index: 1;
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #1429D0; color: #fff;
          border: none; border-radius: 12px;
          padding: 0.8rem 1.75rem;
          font-size: 0.88rem; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; white-space: nowrap;
          transition: all 0.2s ease;
          box-shadow: 0 6px 20px rgba(20,41,208,0.35);
          flex-shrink: 0;
        }
        .ps-strip-btn:hover {
          background: #1835e8;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(20,41,208,0.45);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .ps-grid { grid-template-columns: 1fr 1fr; }
          .ps-connector { display: none; }
          .ps-strip { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 500px) {
          .ps-grid { grid-template-columns: 1fr; }
          .ps { padding: 4.5rem 4%; }
          .ps-strip { padding: 1.5rem; }
        }
      `}</style>

      <section id="process" ref={ref} className="ps">
        <div className="ps-bg" />
        <div className="ps-dots" />

        <div className="ps-inner">

          {/* ── Header ── */}
          <div
            className="ps-header"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(18px)",
              transition: "opacity .55s, transform .55s",
            }}
          >
            <div className="ps-label">
              <span className="ps-label-dot" />
              How It Works
            </div>
            <h2 className="ps-h2">
              Your Path from <em>Student</em> to <em>Professional</em>
            </h2>
            <p className="ps-desc">
              A structured journey designed so you never feel lost,
              overwhelmed, or alone.
            </p>
          </div>

          {/* ── Steps ── */}
          <div className="ps-steps-wrap">

            {/* Animated connector */}
            <div className="ps-connector">
              <div className={`ps-connector-track${inView ? ' visible' : ''}`} />
            </div>

            <div className="ps-grid">
              {STEPS.map((step, i) => (
                <div
                  key={step.n}
                  className="ps-card"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(36px)",
                    transition: `opacity .55s ${i * 0.12}s, transform .55s ${i * 0.12}s, box-shadow .25s, border-color .25s`,
                  }}
                >
                  {/* Ghost watermark */}
                  <div className="ps-ghost">{step.n}</div>

                  {/* Step badge */}
                  <div className="ps-step-badge">STEP {step.n}</div>

                  {/* Number circle */}
                  <div className="ps-circle">{step.n}</div>

                  <div className="ps-title">{step.title}</div>
                  <div className="ps-desc-text">{step.desc}</div>

                  {/* Bottom bar */}
                  <div className="ps-card-bar" />
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA strip ── */}
          <div
            className="ps-strip"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(20px)",
              transition: "opacity .6s .5s, transform .6s .5s",
            }}
          >
            <div className="ps-strip-orb" />
            <div className="ps-strip-left">
              <div className="ps-strip-heading">Ready to start your journey?</div>
              <div className="ps-strip-sub">Join 2,400+ alumni who transformed their careers with DataPreneur.</div>
            </div>
            <button className="ps-strip-btn">
              Enroll Now →
            </button>
          </div>

        </div>
      </section>
    </>
  );
}