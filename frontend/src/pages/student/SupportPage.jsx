import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { createTicket, getMyTickets } from "../../api/support.api";

const STATUS_COLORS = {
  OPEN:        { bg:"#dbeafe", text:"#1d4ed8" },
  IN_PROGRESS: { bg:"#fef9c3", text:"#92400e" },
  RESOLVED:    { bg:"#dcfce7", text:"#166534" },
  CLOSED:      { bg:"#f3f4f6", text:"#6b7280" },
};

// ── Contact channels ─────────────────────────────────────────
const CONTACT_CHANNELS = [
  {
    icon: "📞",
    label: "Call Us",
    value: "+91 98765 43210",
    sub: "Mon–Sat, 9 AM – 7 PM",
    href: "tel:+919876543210",
    btnLabel: "Call Now",
    bg: "#f0fdf4",
    border: "#86efac",
    color: "#166534",
    btnBg: "#16a34a",
  },
  {
    icon: "✉️",
    label: "Email Us",
    value: "support@datapreneur.in",
    sub: "Reply within 24 hours",
    href: "mailto:support@datapreneur.in",
    btnLabel: "Send Email",
    bg: "#eff6ff",
    border: "#93c5fd",
    color: "#1d4ed8",
    btnBg: "#3b82f6",
  },
  {
    icon: "💬",
    label: "WhatsApp",
    value: "+91 98765 43210",
    sub: "Quick responses on WhatsApp",
    href: "https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20my%20EdTech%20CRM%20account.",
    btnLabel: "Chat on WhatsApp",
    bg: "#f0fdf4",
    border: "#86efac",
    color: "#166534",
    btnBg: "#25D366",
  },
];

export default function SupportPage() {
  const { data: tickets, loading, error, refetch } = useFetch(getMyTickets);
  const [form,      setForm]      = useState({ subject: "", message: "" });
  const [showForm,  setShowForm]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setFormError("");
    try {
      await createTicket(form);
      setForm({ subject: "", message: "" });
      setShowForm(false);
      refetch();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit ticket");
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Support</h1><p>Get help from our team</p></div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ cursor:"pointer", padding:"8px 18px", background:"#6366f1", color:"#fff", border:"none", borderRadius:8, fontWeight:600 }}>
          {showForm ? "Cancel" : "+ New Ticket"}
        </button>
      </div>

      {/* ── Contact channels ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14, marginBottom:28 }}>
        {CONTACT_CHANNELS.map(ch => (
          <div key={ch.label}
            style={{ background:ch.bg, border:`1.5px solid ${ch.border}`, borderRadius:14, padding:"18px 20px" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{ch.icon}</div>
            <p style={{ margin:"0 0 2px", fontWeight:700, fontSize:14, color:"#111827" }}>{ch.label}</p>
            <p style={{ margin:"0 0 2px", fontWeight:600, fontSize:13, color:ch.color }}>{ch.value}</p>
            <p style={{ margin:"0 0 14px", fontSize:11, color:"#6b7280" }}>{ch.sub}</p>
            <a href={ch.href} target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-block", padding:"7px 16px", background:ch.btnBg, color:"#fff", borderRadius:8, fontSize:12, fontWeight:700, textDecoration:"none" }}>
              {ch.btnLabel} →
            </a>
          </div>
        ))}
      </div>

      {/* ── Ticket form ── */}
      {showForm && (
        <section className="admin-section" style={{ marginBottom:24 }}>
          <h2>📋 Submit Support Ticket</h2>
          <p style={{ color:"#6b7280", fontSize:13, margin:"0 0 14px" }}>
            Prefer writing? Submit a ticket and we'll reply within 24 hours.
          </p>
          {formError && <p style={{ color:"#ef4444", marginBottom:8 }}>{formError}</p>}
          <form onSubmit={handleSubmit} style={{ display:"grid", gap:12 }}>
            <input name="subject" placeholder="Subject (e.g. Payment issue, Video not loading)"
              value={form.subject} onChange={handleChange} required
              style={{ padding:"10px 14px", borderRadius:8, border:"1px solid #e5e7eb", fontSize:14 }} />
            <textarea name="message" placeholder="Describe your issue in detail..."
              value={form.message} onChange={handleChange} required rows={4}
              style={{ padding:"10px 14px", borderRadius:8, border:"1px solid #e5e7eb", fontSize:14, resize:"vertical" }} />
            <button type="submit" disabled={saving}
              style={{ padding:"10px 24px", background:"#6366f1", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontWeight:700, width:"fit-content" }}>
              {saving ? "Submitting…" : "Submit Ticket"}
            </button>
          </form>
        </section>
      )}

      {/* ── Ticket list ── */}
      <div style={{ marginTop: 8 }}>
        {tickets?.length > 0 && (
          <h3 style={{ fontSize:14, fontWeight:700, color:"#374151", marginBottom:14 }}>Your Tickets ({tickets.length})</h3>
        )}

        {loading && <p style={{ color:"#6b7280" }}>Loading tickets…</p>}
        {error   && <p style={{ color:"#ef4444" }}>{error}</p>}

        {tickets?.map(t => {
          const sc = STATUS_COLORS[t.status] || STATUS_COLORS.OPEN;
          return (
            <div key={t._id}
              style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"16px 20px", marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <strong style={{ fontSize:15 }}>{t.subject}</strong>
                <span style={{ padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600, background:sc.bg, color:sc.text }}>
                  {t.status}
                </span>
              </div>
              <p style={{ color:"#6b7280", fontSize:13, margin:"0 0 8px" }}>{t.message}</p>
              {t.reply && (
                <div style={{ background:"#f0fdf4", borderRadius:8, padding:"10px 14px", borderLeft:"3px solid #16a34a", marginTop:8 }}>
                  <div style={{ fontSize:12, color:"#16a34a", fontWeight:600, marginBottom:4 }}>💬 Support Reply:</div>
                  <p style={{ margin:0, fontSize:13, color:"#374151" }}>{t.reply}</p>
                </div>
              )}
              <div style={{ color:"#9ca3af", fontSize:11, marginTop:8 }}>
                {new Date(t.createdAt).toLocaleDateString("en-IN", { dateStyle:"medium" })}
              </div>
            </div>
          );
        })}

        {!loading && !tickets?.length && (
          <div style={{ textAlign:"center", padding:"40px 20px", color:"#6b7280" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎧</div>
            <p style={{ margin:0, fontWeight:600 }}>No tickets raised yet</p>
            <p style={{ fontSize:13, marginTop:6 }}>Use the contact options above or click "+ New Ticket"</p>
          </div>
        )}
      </div>
    </div>
  );
}