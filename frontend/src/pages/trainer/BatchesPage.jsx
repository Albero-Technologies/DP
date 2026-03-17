import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getTrainerBatches } from "../../api/trainer.api";
import { getSessionsByBatch } from "../../api/sessions.api";

function getYouTubeId(url) {
  if (!url) return null;
  const s = url.match(/youtu\.be\/([^?&\n#]+)/);
  if (s) return s[1];
  const w = url.match(/[?&]v=([^?&\n#]+)/);
  return w ? w[1] : null;
}

function BatchCard({ batch, onSelect, isSelected }) {
  const vid = getYouTubeId(batch.course?.youtubeLink);
  const pct = batch.capacity > 0 ? Math.round((batch.enrolledCount / batch.capacity) * 100) : 0;
  const daysLeft = batch.endDate
    ? Math.max(0, Math.ceil((new Date(batch.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div onClick={() => onSelect(batch)}
      style={{
        background: "#fff", borderRadius: 14,
        border: `2px solid ${isSelected ? "#6366f1" : "#e5e7eb"}`,
        overflow: "hidden", cursor: "pointer",
        boxShadow: isSelected ? "0 4px 20px rgba(99,102,241,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
        transition: "all 0.2s"
      }}>
      {/* Thumbnail */}
      <div style={{ position: "relative", aspectRatio: "16/9", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", overflow: "hidden" }}>
        {vid
          ? <img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt={batch.course?.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
          : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 36 }}>📚</div>
        }
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
            background: batch.isActive ? "#dcfce7" : "#fee2e2", color: batch.isActive ? "#166534" : "#dc2626" }}>
            {batch.isActive ? "● Active" : "Ended"}
          </span>
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>{batch.name}</h3>
        <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 10 }}>{batch.course?.title || "—"}</div>

        {/* Progress bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
            <span>Students</span><span>{batch.enrolledCount}/{batch.capacity}</span>
          </div>
          <div style={{ background: "#f3f4f6", borderRadius: 99, height: 6 }}>
            <div style={{ background: "#6366f1", borderRadius: 99, height: 6, width: `${pct}%`, transition: "width 0.3s" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#9ca3af" }}>
          <span>📅 {batch.startDate?.slice(0,10)}</span>
          {daysLeft !== null && batch.isActive && <span style={{ color: daysLeft < 7 ? "#ef4444" : "#6b7280" }}>⏳ {daysLeft}d left</span>}
        </div>
      </div>
    </div>
  );
}

function BatchDetail({ batch }) {
  const { data: sessions, loading } = useFetch(() => getSessionsByBatch(batch._id), [batch._id]);
  const upcoming = sessions?.filter(s => new Date(s.sessionDate) >= new Date()) || [];
  const vid = getYouTubeId(batch.course?.youtubeLink);
  const [activeVideo, setActiveVideo] = useState(false);

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      {activeVideo && vid && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setActiveVideo(false)}>
          <div style={{ width: "min(90vw,860px)", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(false)} style={{ position: "absolute", top: 12, right: 16, color: "#fff", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 34, height: 34, fontSize: 18, cursor: "pointer", zIndex: 10 }}>✕</button>
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${vid}?autoplay=1`} title="Course" frameBorder="0" allowFullScreen allow="autoplay" style={{ display: "block" }} />
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>{batch.name}</h2>
          <div style={{ color: "#6b7280", fontSize: 14 }}>{batch.course?.title} · ₹{batch.course?.fees?.toLocaleString()} · {batch.course?.durationInMonths} months</div>
        </div>
        {vid && (
          <button onClick={() => setActiveVideo(true)}
            style={{ padding: "8px 18px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
            ▶ Course Video
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Students", value: `${batch.enrolledCount}/${batch.capacity}`, icon: "👥", color: "#eff6ff" },
          { label: "Start Date", value: batch.startDate?.slice(0,10), icon: "📅", color: "#f0fdf4" },
          { label: "End Date", value: batch.endDate?.slice(0,10), icon: "🏁", color: "#fff7ed" },
        ].map(c => (
          <div key={c.label} style={{ background: c.color, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>
          Upcoming Sessions ({upcoming.length})
        </h3>
        {loading && <p style={{ color: "#6b7280", fontSize: 13 }}>Loading sessions...</p>}
        {upcoming.length === 0 && !loading && <p style={{ color: "#9ca3af", fontSize: 13 }}>No upcoming sessions scheduled.</p>}
        {upcoming.slice(0, 3).map(s => (
          <div key={s._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
              <div style={{ color: "#6b7280", fontSize: 12 }}>🕐 {s.startTime} – {s.endTime}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#6366f1" }}>{new Date(s.sessionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
              {s.meetingLink && <a href={s.meetingLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#6366f1" }}>Join →</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrainerBatchesPage() {
  const { data: batches, loading, error } = useFetch(getTrainerBatches);
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>My Cohorts</h1><p>All batches assigned to you</p></div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="admin-pill" style={{ background: "#dcfce7", color: "#166534" }}>
            {batches?.filter(b => b.isActive).length ?? 0} Active
          </span>
          <span className="admin-pill">{batches?.length ?? 0} Total</span>
        </div>
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading batches...</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      {!loading && !batches?.length && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📦</div>
          <p>No batches assigned yet. Your counselor will assign you to batches.</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr" : "repeat(auto-fill,minmax(280px,1fr))", gap: 16, alignContent: "start" }}>
          {batches?.map(b => (
            <BatchCard key={b._id} batch={b} isSelected={selected?._id === b._id} onSelect={b => setSelected(prev => prev?._id === b._id ? null : b)} />
          ))}
        </div>
        {selected && <BatchDetail batch={selected} />}
      </div>
    </div>
  );
}