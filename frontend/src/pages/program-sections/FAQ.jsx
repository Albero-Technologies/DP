import { useState } from "react";
import { useInView } from "../../hooks/useInView";
// import EnrollModal from "../../components/EnrollModel";

const PhoneIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C9.4 21 3 14.6 3 7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1L6.6 10.8z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChatIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 10h8M8 14h5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const QuestionIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 9a3 3 0 1 1 4 2.83c-.83.4-1 .9-1 1.67" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1" fill={color}/>
  </svg>
);

function FAQItem({ faq, index, inView, isOpen, onToggle }) {
  const open = isOpen;


  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: `1.5px solid ${open ? "#1429D0" : "rgba(20,41,208,0.10)"}`,
      overflow: "hidden",
      transition: "all .3s ease",
      boxShadow: open ? "0 12px 32px rgba(20,41,208,0.10)" : "0 2px 8px rgba(20,41,208,0.04)",
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : "translateY(18px)",
      transitionDelay: `${index * .07}s`,
    }}>
      <button
        onClick={() => onToggle(index)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.3rem 1.6rem", background: "none", border: "none",
          cursor: "pointer", textAlign: "left", gap: "1rem",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flex: 1 }}>
          {/* Question icon box */}
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: open ? "#1429D0" : "#F2F5FF",
            border: `1px solid ${open ? "transparent" : "rgba(20,41,208,0.14)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .3s ease",
          }}>
            <QuestionIcon color={open ? "#fff" : "#1429D0"} />
          </div>

          <span style={{ fontWeight: 700, fontSize: "0.97rem", color: open ? "#161619" : "#262832", lineHeight: 1.4 }}>
            {faq.q}
          </span>
        </div>

        {/* Expand / collapse circle */}
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: open ? "#1429D0" : "rgba(20,41,208,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .3s ease",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transition: "transform .3s", transform: open ? "rotate(45deg)" : "none" }}>
            <path d="M7 1v12M1 7h12" stroke={open ? "#fff" : "#1429D0"} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </button>

      {/* Answer */}
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height .4s cubic-bezier(.4,0,.2,1)" }}>
        <div style={{ padding: "0 1.6rem 1.4rem", paddingLeft: "calc(1.6rem + 48px)" }}>
          <p style={{ fontSize: "0.92rem", color: "#36383e", lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ({ course }) {
  const [ref, inView] = useInView(0.05);
  const [activeIndex, setActiveIndex] = useState(null);
  // Enroll modal state
  // const [modalOpen, setModalOpen] = useState(false);

  const handleToggle = (i) => setActiveIndex(prev => prev === i ? null : i);

  return (
    <>
      {/* Enroll modal outside the main section to avoid z-index and overflow issues */}
      {/* <EnrollModal isOpen={modalOpen} onClose={() => setModalOpen(false)} /> */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        .dp-faq-call:hover  { transform: translateY(-2px) !important; background: #F2F5FF !important; }
        .dp-faq-chat:hover  { transform: translateY(-2px) !important; background: #1E3A8A !important; box-shadow: 0 10px 28px rgba(20,41,208,0.36) !important; }
      `}</style>

      <section ref={ref} style={{
        padding: "90px 5%",
        background: "#F5F7FA",
        position: "relative", overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Blobs — no grid */}
        <div style={{ position: "absolute", top: -60, right: -40, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,41,208,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,127,221,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <div style={{
            textAlign: "center", marginBottom: "3.5rem",
            opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all .6s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: "1.1rem" }}>
              <span style={{ width: 22, height: 2, background: "#1429D0", borderRadius: 2, display: "inline-block" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1429D0", letterSpacing: "2.5px", textTransform: "uppercase" }}>FAQ</span>
              <span style={{ width: 22, height: 2, background: "#1429D0", borderRadius: 2, display: "inline-block" }} />
            </div>
            <h2 style={{
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900,
              color: "#161619", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: ".8rem",
            }}>
              Got{" "}
              <span style={{
                background: "linear-gradient(135deg, #1429D0, #0E7FDD)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Questions?
              </span>
            </h2>
            <p style={{ color: "#36383e", fontSize: "1rem", lineHeight: 1.75, maxWidth: 440, margin: "0 auto" }}>
              Everything you need to know before enrolling. Can't find your answer? Talk to our team.
            </p>
          </div>

          {/* FAQ list */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
            {course.faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} inView={inView} isOpen={activeIndex === i} onToggle={handleToggle} />
            ))}
          </div>

          {/* Still have questions */}
          <div style={{
            marginTop: "3rem", padding: "2rem 2.5rem",
            background: "#fff", borderRadius: 20,
            border: "1.5px solid rgba(20,41,208,0.12)",
            boxShadow: "0 8px 40px rgba(20,41,208,0.07)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1.5rem",
            opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)", transition: "all .6s .5s ease",
            position: "relative", overflow: "hidden",
          }}>
            {/* Accent left bar */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "linear-gradient(to bottom, #1429D0, #0E7FDD)", borderRadius: "20px 0 0 20px" }} />

            <div style={{ paddingLeft: "0.5rem" }}>
              <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#161619", marginBottom: ".35rem", letterSpacing: "-0.02em" }}>
                Still have questions?
              </div>
              <p style={{ fontSize: "0.88rem", color: "#36383e", margin: 0, lineHeight: 1.6 }}>
                Our team responds within 2 hours. No bots, no scripts — just honest answers.
              </p>
            </div>

            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              <button
                className="dp-faq-call"
                style={{
                  padding: ".75rem 1.5rem", borderRadius: 10,
                  border: "1.5px solid rgba(20,41,208,0.20)",
                  background: "#fff", color: "#1429D0",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 700,
                  cursor: "pointer", transition: "all .2s ease",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}
                onClick={() => window.location.href = "tel:+1234567890"}
              >
                <PhoneIcon color="#1429D0" />
                Call Us
              </button>

              <button
                className="dp-faq-chat"
                style={{
                  padding: ".75rem 1.5rem", borderRadius: 10, border: "none",
                  background: "#1429D0", color: "#fff",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(20,41,208,0.28)",
                  transition: "all .2s ease",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}
                // onClick={() => setModalOpen(true)}
                onClickCapture={()=>window.open("https://wa.me/919305823308?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20programs%20at%20DataPreneur.", "_blank")}
              >
                <ChatIcon color="#fff" />
                Chat Now
              </button>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}