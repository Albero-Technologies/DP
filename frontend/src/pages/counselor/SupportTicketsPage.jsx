import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getAllTickets, replyTicket } from "../../api/support.api";

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const STATUS_STYLE = {
  OPEN:        { bg: "#dbeafe", text: "#1d4ed8" },
  IN_PROGRESS: { bg: "#fef9c3", text: "#92400e" },
  RESOLVED:    { bg: "#dcfce7", text: "#166534" },
  CLOSED:      { bg: "#f3f4f6", text: "#6b7280" },
};

export default function SupportTicketsPage() {
  const { data: tickets, loading, error, refetch } = useFetch(getAllTickets);
  // replyForm: { [ticketId]: { reply: "", status: "" } }
  const [replyForm, setReplyForm] = useState({});
  const [saving, setSaving] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const setField = (id, field, value) =>
    setReplyForm(p => ({ ...p, [id]: { ...(p[id] || {}), [field]: value } }));

  const handleReply = async (ticket) => {
    const form = replyForm[ticket._id] || {};
    const reply = form.reply || "";
    const status = form.status || ticket.status;

    setSaving(ticket._id);
    try {
      await replyTicket(ticket._id, reply, status);
      // Clear form for this ticket after save
      setReplyForm(p => { const n = { ...p }; delete n[ticket._id]; return n; });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update ticket");
    } finally { setSaving(null); }
  };

  const displayed = filterStatus === "ALL"
    ? (tickets || [])
    : (tickets || []).filter(t => t.status === filterStatus);

  const openCount = tickets?.filter(t => t.status === "OPEN").length || 0;

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Support Tickets</h1><p>Student support requests</p></div>
        <span className="admin-pill" style={{ background: openCount > 0 ? "#dbeafe" : "#f3f4f6", color: openCount > 0 ? "#1d4ed8" : "#6b7280" }}>
          {tickets?.length ?? 0} tickets
        </span>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["ALL", ...STATUS_OPTIONS].map(s => {
          const count = s === "ALL" ? tickets?.length : tickets?.filter(t => t.status === s).length;
          return (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: filterStatus === s ? "#6366f1" : "#f3f4f6", color: filterStatus === s ? "#fff" : "#374151" }}>
              {s} {count ? `(${count})` : ""}
            </button>
          );
        })}
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading...</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {displayed.map(t => {
          const sc = STATUS_STYLE[t.status] || STATUS_STYLE.OPEN;
          const form = replyForm[t._id] || {};
          const currentStatus = form.status || t.status;
          return (
            <div key={t._id} style={{ background: "#fff", border: `1px solid ${t.status === "OPEN" ? "#bfdbfe" : "#e5e7eb"}`, borderRadius: 12, padding: "18px 22px" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <strong style={{ fontSize: 15 }}>{t.subject}</strong>
                  <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
                    {t.student?.name} · {t.student?.email} · {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span style={{ padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: sc.bg, color: sc.text, flexShrink: 0 }}>
                  {t.status}
                </span>
              </div>

              {/* Message */}
              <p style={{ color: "#374151", fontSize: 14, margin: "0 0 12px", lineHeight: 1.5 }}>{t.message}</p>

              {/* Previous reply */}
              {t.reply && (
                <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "10px 14px", borderLeft: "3px solid #16a34a", marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 700, marginBottom: 4 }}>Previous Reply:</div>
                  <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>{t.reply}</p>
                </div>
              )}

              {/* Reply form */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 180px auto", gap: 10, alignItems: "center" }}>
                <input
                  placeholder="Type reply..."
                  value={form.reply || ""}
                  onChange={e => setField(t._id, "reply", e.target.value)}
                  style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
                />
                <select
                  value={currentStatus}
                  onChange={e => setField(t._id, "status", e.target.value)}
                  style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, background: STATUS_STYLE[currentStatus]?.bg || "#fff", color: STATUS_STYLE[currentStatus]?.text || "#374151", fontWeight: 600 }}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  onClick={() => handleReply(t)}
                  disabled={saving === t._id}
                  style={{ padding: "9px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                  {saving === t._id ? "Saving..." : "Update →"}
                </button>
              </div>
            </div>
          );
        })}

        {!loading && !displayed.length && (
          <div style={{ textAlign: "center", padding: "50px 20px", color: "#6b7280" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🎧</div>
            <p>No {filterStatus === "ALL" ? "" : filterStatus.toLowerCase()} tickets found.</p>
          </div>
        )}
      </div>
    </div>
  );
}