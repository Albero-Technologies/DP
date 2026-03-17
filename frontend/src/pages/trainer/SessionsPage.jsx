import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getMyTrainerSessions } from "../../api/sessions.api";
import { getTrainerBatches } from "../../api/trainer.api";

const STATUS_STYLE = {
  SCHEDULED:  { bg: "#dbeafe", text: "#1d4ed8", icon: "🗓" },
  COMPLETED:  { bg: "#dcfce7", text: "#166534", icon: "✅" },
  CANCELLED:  { bg: "#fee2e2", text: "#dc2626", icon: "❌" },
};

function SessionCard({ session, style = {} }) {
  const dateObj = session.sessionDate ? new Date(session.sessionDate) : null;
  const isPast = dateObj && dateObj < new Date();
  const isToday = dateObj && dateObj.toDateString() === new Date().toDateString();
  const ss = STATUS_STYLE[session.status] || STATUS_STYLE.SCHEDULED;

  return (
    <div style={{ background: isPast ? "#fafafa" : "#fff", border: `1px solid ${isToday ? "#6366f1" : "#e5e7eb"}`, borderRadius: 12, padding: "16px 18px", opacity: isPast ? 0.8 : 1, ...style }}>
      {isToday && (
        <div style={{ marginBottom: 8 }}>
          <span style={{ background: "#6366f1", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>TODAY</span>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <strong style={{ fontSize: 15 }}>{session.title}</strong>
            {session.isRecurring && (
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: "#ede9fe", color: "#7c3aed", fontWeight: 700 }}>🔁</span>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 13, color: "#6b7280" }}>
            {dateObj && <span>📅 {dateObj.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>}
            <span>🕐 {session.startTime} – {session.endTime}</span>
            <span>📦 {session.batch?.name}</span>
          </div>
          {session.description && (
            <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 6 }}>{session.description}</div>
          )}
          {session.meetingLink && (
            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, padding: "5px 14px", background: "#6366f1", color: "#fff", borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              🔗 Join Meeting
            </a>
          )}
        </div>
        <div style={{ textAlign: "right", marginLeft: 12, flexShrink: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 22, color: isToday ? "#6366f1" : "#374151", lineHeight: 1 }}>
            {dateObj?.toLocaleDateString("en-IN", { day: "numeric" })}
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            {dateObj?.toLocaleDateString("en-IN", { month: "short" })}
          </div>
          <div style={{ marginTop: 6 }}>
            <span style={{ padding: "3px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700, background: ss.bg, color: ss.text }}>
              {ss.icon} {session.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrainerSessionsPage() {
  const { data: sessions, loading, error } = useFetch(getMyTrainerSessions);
  const { data: batches } = useFetch(getTrainerBatches);
  const [tab, setTab] = useState("upcoming");
  const [filterBatch, setFilterBatch] = useState("ALL");

  const now = new Date();
  const today = sessions?.filter(s => s.sessionDate && new Date(s.sessionDate).toDateString() === now.toDateString()) || [];
  const upcoming = sessions?.filter(s => s.sessionDate && new Date(s.sessionDate) > now) || [];
  const past = sessions?.filter(s => s.sessionDate && new Date(s.sessionDate) < now && new Date(s.sessionDate).toDateString() !== now.toDateString()) || [];

  const filterFn = (list) => filterBatch === "ALL" ? list : list.filter(s => s.batch?._id?.toString() === filterBatch.toString());

  const tabData = { today: filterFn(today), upcoming: filterFn(upcoming), past: filterFn(past) };
  const current = tabData[tab] || [];

  const TAB = (key, label, count, color = "#6366f1") => (
    <button onClick={() => setTab(key)}
      style={{ padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
        background: tab === key ? color : "#f3f4f6", color: tab === key ? "#fff" : "#374151" }}>
      {label} {count > 0 && <span style={{ background: tab === key ? "rgba(255,255,255,0.3)" : "#e5e7eb", color: tab === key ? "#fff" : "#6b7280", borderRadius: 99, padding: "1px 7px", fontSize: 11, marginLeft: 4 }}>{count}</span>}
    </button>
  );

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>My Sessions</h1><p>All your scheduled training sessions</p></div>
        <div style={{ display: "flex", gap: 8 }}>
          {today.length > 0 && (
            <span style={{ padding: "5px 14px", borderRadius: 99, background: "#6366f1", color: "#fff", fontWeight: 700, fontSize: 13 }}>
              🔴 {today.length} session{today.length > 1 ? "s" : ""} today
            </span>
          )}
          <span className="admin-pill">{sessions?.length ?? 0} total</span>
        </div>
      </div>

      {/* Summary stats */}
      {!loading && sessions?.length > 0 && (
        <div className="admin-metrics" style={{ marginBottom: 24 }}>
          {[
            { label: "Today", value: today.length, icon: "📍", color: "#eff6ff" },
            { label: "Upcoming", value: upcoming.length, icon: "🗓", color: "#f0fdf4" },
            { label: "Completed", value: sessions.filter(s => s.status === "COMPLETED").length, icon: "✅", color: "#dcfce7" },
            { label: "Total Sessions", value: sessions.length, icon: "📊", color: "#fafafa" },
          ].map(c => (
            <div key={c.label} style={{ background: c.color, borderRadius: 12, padding: "16px 20px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{c.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 24 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{c.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {TAB("today", "Today", today.length, "#ef4444")}
          {TAB("upcoming", "Upcoming", upcoming.length, "#6366f1")}
          {TAB("past", "Past", past.length, "#6b7280")}
        </div>
        <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}>
          <option value="ALL">All Batches</option>
          {batches?.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading sessions...</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {current.map(s => <SessionCard key={s._id} session={s} />)}
      </div>

      {!loading && !current.length && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>
            {tab === "today" ? "☀️" : tab === "upcoming" ? "🗓" : "📁"}
          </div>
          <p style={{ fontSize: 15 }}>
            {tab === "today" ? "No sessions scheduled for today." : tab === "upcoming" ? "No upcoming sessions." : "No past sessions."}
          </p>
        </div>
      )}
    </div>
  );
}