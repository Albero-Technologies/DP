import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getTrainerBatches } from "../../api/trainer.api";
import { getSessionsByBatch } from "../../api/sessions.api";

function getYouTubeId(url) {
  if (!url) return null;
  const s = url.match(/youtu\.be\/([^?&\n#]+)/);
  if (s) return s[1];
  const w = url.match(/[?&]v=([^?&\n#]+)/);
  if (w) return w[1];
  const e = url.match(/embed\/([^?&\n#]+)/);
  return e ? e[1] : null;
}

function VideoModal({ videoId, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "min(90vw,860px)", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 10, right: 14, color: "#fff", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 34, height: 34, fontSize: 18, cursor: "pointer", zIndex: 10 }}>✕</button>
        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="Video" frameBorder="0" allowFullScreen allow="autoplay" style={{ display: "block" }} />
      </div>
    </div>
  );
}

function BatchCard({ batch, onSelect, isSelected }) {
  const firstVid = batch.course?.videos?.length > 0
    ? getYouTubeId(batch.course.videos[0].url)
    : getYouTubeId(batch.course?.youtubeLink);
  const videoCount = (batch.course?.videos?.length || 0) + (batch.course?.youtubeLink ? 1 : 0);
  const pct = batch.capacity > 0 ? Math.round((batch.enrolledCount / batch.capacity) * 100) : 0;
  const daysLeft = batch.endDate
    ? Math.max(0, Math.ceil((new Date(batch.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div onClick={() => onSelect(batch)}
      style={{ background: "#fff", borderRadius: 14, border: `2px solid ${isSelected ? "#6366f1" : "#e5e7eb"}`,
        overflow: "hidden", cursor: "pointer",
        boxShadow: isSelected ? "0 4px 20px rgba(99,102,241,0.15)" : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s" }}>
      <div style={{ position: "relative", aspectRatio: "16/9", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", overflow: "hidden" }}>
        {firstVid
          ? <img src={`https://img.youtube.com/vi/${firstVid}/hqdefault.jpg`} alt={batch.course?.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
          : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 36 }}>📚</div>
        }
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 5 }}>
          {videoCount > 0 && (
            <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700, background: "rgba(0,0,0,0.65)", color: "#fff" }}>
              {videoCount} video{videoCount > 1 ? "s" : ""}
            </span>
          )}
          <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
            background: batch.isActive ? "#dcfce7" : "#fee2e2", color: batch.isActive ? "#166534" : "#dc2626" }}>
            {batch.isActive ? "● Active" : "Ended"}
          </span>
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>{batch.name}</h3>
        <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 10 }}>{batch.course?.title || "—"}</div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
            <span>Students</span><span>{batch.enrolledCount}/{batch.capacity}</span>
          </div>
          <div style={{ background: "#f3f4f6", borderRadius: 99, height: 6 }}>
            <div style={{ background: "#6366f1", borderRadius: 99, height: 6, width: `${pct}%` }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#9ca3af" }}>
          <span>📅 {batch.startDate?.slice(0,10)}</span>
          {daysLeft !== null && batch.isActive && (
            <span style={{ color: daysLeft < 7 ? "#ef4444" : "#6b7280" }}>⏳ {daysLeft}d left</span>
          )}
        </div>
      </div>
    </div>
  );
}

function BatchDetail({ batch }) {
  const { data: sessions, loading } = useFetch(() => getSessionsByBatch(batch._id), [batch._id]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const upcoming = sessions?.filter(s => new Date(s.sessionDate) >= new Date()) || [];

  // All videos: intro + modules
  const allVideos = [];
  if (batch.course?.youtubeLink) {
    allVideos.push({ _id: "intro", title: "Intro / Promo Video", url: batch.course.youtubeLink, isIntro: true });
  }
  if (batch.course?.videos?.length) {
    [...batch.course.videos].sort((a, b) => a.order - b.order).forEach(v => allVideos.push(v));
  }

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      {activeVideoId && <VideoModal videoId={activeVideoId} onClose={() => setActiveVideoId(null)} />}

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>{batch.name}</h2>
        <div style={{ color: "#6b7280", fontSize: 14 }}>
          {batch.course?.title} · ₹{batch.course?.fees?.toLocaleString("en-IN")} · {batch.course?.durationInMonths} months
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Students",   value: `${batch.enrolledCount}/${batch.capacity}`, icon: "👥", color: "#eff6ff" },
          { label: "Start Date", value: batch.startDate?.slice(0,10),               icon: "📅", color: "#f0fdf4" },
          { label: "End Date",   value: batch.endDate?.slice(0,10),                 icon: "🏁", color: "#fff7ed" },
        ].map(c => (
          <div key={c.label} style={{ background: c.color, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Course Videos */}
      {allVideos.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>
            Course Videos ({allVideos.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {allVideos.map((video, idx) => {
              const vid = getYouTubeId(video.url);
              return (
                <div key={video._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                  background: video.isIntro ? "#f0f9ff" : "#f8fafc", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                  <div style={{ width: 60, height: 36, borderRadius: 5, background: "#000", overflow: "hidden", flexShrink: 0, position: "relative", cursor: vid ? "pointer" : "default" }}
                    onClick={() => vid && setActiveVideoId(vid)}>
                    {vid && <img src={`https://img.youtube.com/vi/${vid}/default.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    {vid && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 12 }}>▶</div>}
                  </div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13, flex: 1, color: video.isIntro ? "#0369a1" : "#111827",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {video.isIntro ? "🎬 " : `${idx}. `}{video.title}
                  </p>
                  {vid && (
                    <button onClick={() => setActiveVideoId(vid)}
                      style={{ padding: "3px 10px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                      ▶ Play
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Sessions */}
      <div>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>
          Upcoming Sessions ({upcoming.length})
        </h3>
        {loading && <p style={{ color: "#6b7280", fontSize: 13 }}>Loading…</p>}
        {!loading && upcoming.length === 0 && <p style={{ color: "#9ca3af", fontSize: 13 }}>No upcoming sessions.</p>}
        {upcoming.slice(0, 5).map(s => (
          <div key={s._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
              <div style={{ color: "#6b7280", fontSize: 12 }}>🕐 {s.startTime} – {s.endTime}</div>
              {s.meetingLink && (
                <a href={s.meetingLink} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>🔗 Join Meeting →</a>
              )}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#6366f1" }}>
              {new Date(s.sessionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
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

      {loading && <p style={{ color: "#6b7280" }}>Loading batches…</p>}
      {error   && <p style={{ color: "#ef4444" }}>{error}</p>}

      {!loading && !batches?.length && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📦</div>
          <p>No batches assigned yet. Your counselor will assign you to batches.</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: selected ? "300px 1fr" : "repeat(auto-fill,minmax(300px,1fr))", gap: 20, alignItems: "start" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          {batches?.map(b => (
            <BatchCard key={b._id} batch={b} isSelected={selected?._id === b._id}
              onSelect={b => setSelected(prev => prev?._id === b._id ? null : b)} />
          ))}
        </div>
        {selected && <BatchDetail batch={selected} />}
      </div>
    </div>
  );
}