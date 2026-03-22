import { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import API from "../../api/axiosInstance";

function getYouTubeId(url) {
  if (!url) return null;
  const s = url.match(/youtu\.be\/([^?&\n#]+)/);
  if (s) return s[1];
  const w = url.match(/[?&]v=([^?&\n#]+)/);
  if (w) return w[1];
  const e = url.match(/embed\/([^?&\n#]+)/);
  return e ? e[1] : null;
}

// ── Video Modal ───────────────────────────────────────────────
function VideoModal({ videoId, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "min(92vw,900px)", aspectRatio: "16/9", borderRadius: 14, overflow: "hidden", position: "relative", boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 10, right: 14, color: "#fff", background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", width: 34, height: 34, fontSize: 18, cursor: "pointer", zIndex: 10, lineHeight: "34px" }}>✕</button>
        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="Video" frameBorder="0" allowFullScreen allow="autoplay" style={{ display: "block" }} />
      </div>
    </div>
  );
}

// ── Lock Overlay ─────────────────────────────────────────────
function LockOverlay({ message }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, zIndex: 5 }}>
      <span style={{ fontSize: 28 }}>🔒</span>
      <p style={{ color: "#fff", fontSize: 11, fontWeight: 700, textAlign: "center", margin: 0, padding: "0 12px", lineHeight: 1.4 }}>{message}</p>
    </div>
  );
}

// ── Demo Courses Section ─────────────────────────────────────
function DemoCoursesSection({ accessStatus }) {
  const [courses,     setCourses]     = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const isLocked = accessStatus === "INACTIVE";

  useEffect(() => {
    API.get("/demo-courses").then(r => setCourses(r.data.data || [])).catch(() => {});
  }, []);

  if (!courses.length) return null;

  return (
    <section className="admin-section" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <h2 style={{ margin: 0 }}>🎓 Free Demo Classes</h2>
        {isLocked && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: "#fee2e2", color: "#dc2626" }}>
            🔒 Pay to unlock
          </span>
        )}
        {!isLocked && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: "#dcfce7", color: "#166534" }}>
            ✅ Unlocked
          </span>
        )}
      </div>

      {isLocked && (
        <div style={{ background: "#fef9c3", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#92400e" }}>
          ⚠️ Demo videos are locked. Complete your first payment to unlock access.
        </div>
      )}

      {activeVideo && !isLocked && <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
        {courses.map(c => {
          // Combine intro + module videos
          const allVideos = [];
          if (c.youtubeLink) allVideos.push({ _id: "intro", title: "Intro Video", url: c.youtubeLink });
          if (c.videos?.length) allVideos.push(...c.videos.sort((a, b) => a.order - b.order));

          const firstVid = getYouTubeId(allVideos[0]?.url);
          const videoCount = allVideos.length;

          return (
            <div key={c._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              {/* Thumbnail */}
              <div style={{ position: "relative", aspectRatio: "16/9", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", cursor: isLocked ? "not-allowed" : "pointer", overflow: "hidden" }}
                onClick={() => !isLocked && firstVid && setActiveVideo(firstVid)}>
                {firstVid && (
                  <img src={`https://img.youtube.com/vi/${firstVid}/hqdefault.jpg`} alt={c.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: isLocked ? "brightness(0.4)" : "none" }} />
                )}
                {!isLocked && firstVid && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.1)" }}>
                    <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>▶</div>
                  </div>
                )}
                {isLocked && <LockOverlay message="Complete payment to unlock" />}
                {videoCount > 0 && (
                  <div style={{ position: "absolute", top: 7, left: 7, background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6 }}>
                    {videoCount} video{videoCount > 1 ? "s" : ""}
                  </div>
                )}
              </div>

              <div style={{ padding: "12px 14px" }}>
                <strong style={{ fontSize: 14 }}>{c.title}</strong>
                {c.description && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>{c.description}</p>}

                {/* Video list — show titles even if locked */}
                {allVideos.length > 1 && (
                  <div style={{ marginTop: 10 }}>
                    {allVideos.map((v, idx) => {
                      const vid = getYouTubeId(v.url);
                      return (
                        <div key={v._id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: idx < allVideos.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <div style={{ width: 40, height: 24, background: "#000", borderRadius: 4, overflow: "hidden", flexShrink: 0, position: "relative" }}>
                            {vid && <img src={`https://img.youtube.com/vi/${vid}/default.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: isLocked ? "brightness(0.3)" : "none" }} />}
                            {isLocked && <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🔒</span>}
                          </div>
                          <p style={{ margin: 0, fontSize: 12, color: "#374151", flex: 1 }}>
                            {idx === 0 && v._id === "intro" ? "🎬 " : `${idx}. `}{v.title}
                          </p>
                          {!isLocked && vid && (
                            <button onClick={() => setActiveVideo(vid)}
                              style={{ padding: "2px 7px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 10, fontWeight: 600 }}>
                              ▶
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── My Batch / Courses Section ───────────────────────────────
function MyBatchesSection({ accessStatus }) {
  const [enrollments, setEnrollments] = useState([]);
  const [activeVideo,  setActiveVideo]  = useState(null);

  useEffect(() => {
    API.get("/student/courses").then(r => setEnrollments(r.data.data || [])).catch(() => {});
  }, []);

  if (!enrollments.length) return null;

  // Access rules:
  // INACTIVE → everything locked
  // TRIAL    → can see batch info + demo videos, course content locked
  // ACTIVE   → full access

  const canAccessCourse = accessStatus === "ACTIVE";
  const canSeeBatch     = accessStatus !== "INACTIVE";

  return (
    <section className="admin-section" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <h2 style={{ margin: 0 }}>📚 My Batches</h2>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99,
          background: canAccessCourse ? "#dcfce7" : accessStatus === "TRIAL" ? "#fef9c3" : "#fee2e2",
          color: canAccessCourse ? "#166534" : accessStatus === "TRIAL" ? "#854d0e" : "#dc2626" }}>
          {canAccessCourse ? "✅ Full Access" : accessStatus === "TRIAL" ? "⏳ Trial Access" : "🔒 Locked"}
        </span>
      </div>

      {!canAccessCourse && (
        <div style={{ background: accessStatus === "TRIAL" ? "#fef9c3" : "#fee2e2", border: `1px solid ${accessStatus === "TRIAL" ? "#fde68a" : "#fecaca"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: accessStatus === "TRIAL" ? "#92400e" : "#dc2626" }}>
          {accessStatus === "TRIAL"
            ? "⏳ Trial mode — Complete full payment to unlock all course videos."
            : "🔒 Your account is inactive. Contact your counselor to get started."}
        </div>
      )}

      {activeVideo && <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />}

      {enrollments.map(enrollment => {
        const batch  = enrollment.batch;
        const course = batch?.course;
        if (!batch || !course) return null;

        const allVideos = [];
        if (course.youtubeLink) allVideos.push({ _id: "intro", title: "Intro / Promo Video", url: course.youtubeLink, isIntro: true });
        if (course.videos?.length) allVideos.push(...course.videos.sort((a, b) => a.order - b.order));

        const firstVid = getYouTubeId(allVideos[0]?.url);

        return (
          <div key={enrollment._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            {/* Course thumbnail header */}
            <div style={{ position: "relative", height: 160, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", overflow: "hidden", cursor: canAccessCourse && firstVid ? "pointer" : "default" }}
              onClick={() => canAccessCourse && firstVid && setActiveVideo(firstVid)}>
              {firstVid && (
                <img src={`https://img.youtube.com/vi/${firstVid}/hqdefault.jpg`} alt={course.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: !canAccessCourse ? "brightness(0.35)" : "brightness(0.8)" }} />
              )}
              {canAccessCourse && firstVid && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>▶</div>
                </div>
              )}
              {!canAccessCourse && <LockOverlay message={accessStatus === "TRIAL" ? "Complete full payment to unlock" : "Inactive — contact counselor"} />}

              {/* Batch info overlay */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(0,0,0,0.7))", padding: "20px 16px 12px" }}>
                <h3 style={{ margin: 0, color: "#fff", fontSize: 16, fontWeight: 700 }}>{batch.name}</h3>
                <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                  {course.title} · {batch.startDate?.slice(0,10)} → {batch.endDate?.slice(0,10)}
                </p>
              </div>
            </div>

            {/* Videos list */}
            {allVideos.length > 0 && (
              <div style={{ padding: "12px 16px" }}>
                <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Course Content ({allVideos.length} videos)
                </p>
                {allVideos.map((video, idx) => {
                  const vid = getYouTubeId(video.url);
                  const isUnlocked = canAccessCourse;
                  return (
                    <div key={video._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: idx < allVideos.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                      {/* Thumbnail */}
                      <div style={{ width: 64, height: 38, background: "#000", borderRadius: 6, flexShrink: 0, overflow: "hidden", position: "relative" }}>
                        {vid && <img src={`https://img.youtube.com/vi/${vid}/default.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: isUnlocked ? "none" : "brightness(0.25)" }} />}
                        {!isUnlocked && <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔒</span>}
                      </div>
                      <p style={{ margin: 0, fontSize: 13, flex: 1, color: isUnlocked ? "#111827" : "#9ca3af", fontWeight: video.isIntro ? 700 : 500 }}>
                        {video.isIntro ? "🎬 " : `${idx}. `}{video.title}
                      </p>
                      {isUnlocked && vid ? (
                        <button onClick={() => setActiveVideo(vid)}
                          style={{ padding: "4px 12px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                          ▶ Play
                        </button>
                      ) : (
                        <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

// ── Main Dashboard ───────────────────────────────────────────
export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/reports/student-dashboard")
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch fresh accessStatus from API (localStorage might be stale)
  const [accessStatus, setAccessStatus] = useState(user?.accessStatus || "INACTIVE");

  useEffect(() => {
    API.get("/auth/me")
      .then(r => {
        const freshUser = r.data.user || r.data;
        if (freshUser?.accessStatus) {
          setAccessStatus(freshUser.accessStatus);
          // Update localStorage too
          const stored = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem("user", JSON.stringify({ ...stored, ...freshUser }));
        }
      })
      .catch(() => {});
  }, []);

  const ACCESS_INFO = {
    INACTIVE: { bg: "#fee2e2", color: "#dc2626", text: "🔒 Inactive — Contact your counselor to get started", icon: "🔒" },
    TRIAL:    { bg: "#fef9c3", color: "#854d0e", text: "⏳ Trial Access — Complete full payment to unlock everything", icon: "⏳" },
    ACTIVE:   { bg: "#dcfce7", color: "#166534", text: "✅ Full Access — All content is unlocked!", icon: "✅" },
  };
  const info = ACCESS_INFO[accessStatus] || ACCESS_INFO.INACTIVE;

  return (
    <div>
      {/* Welcome banner */}
      <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 16, padding: "22px 28px", color: "#fff", marginBottom: 20 }}>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Welcome back,</div>
        <h1 style={{ margin: "4px 0 4px", fontSize: 22, fontWeight: 800 }}>
          {user?.name} {info.icon}
        </h1>
        <div style={{ opacity: 0.8, fontSize: 13 }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
        {user?.studentId && (
          <div style={{ marginTop: 8, display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "3px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
            ID: {user.studentId}
          </div>
        )}
      </div>

      {/* Access status banner */}
      <div style={{ background: info.bg, border: `1px solid`, borderColor: info.color + "44", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: info.color, fontWeight: 600 }}>
        {info.text}
      </div>

      {/* Stats cards */}
      {loading ? (
        <div className="admin-metrics" style={{ marginBottom: 24 }}>
          {[1,2,3].map(i => <div key={i} className="admin-card" style={{ opacity: 0.4 }}><h3>Loading…</h3><div className="admin-metric-value">—</div></div>)}
        </div>
      ) : stats && !stats.message ? (
        <div className="admin-metrics" style={{ marginBottom: 24 }}>
          <div className="admin-card admin-card--indigo">
            <h3>My Course</h3>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4, lineHeight: 1.3 }}>
              {stats.enrollment?.batch?.course?.title ?? "—"}
            </div>
            <div className="admin-pill" style={{ marginTop: 8 }}>{stats.enrollment?.status || "ACTIVE"}</div>
          </div>
          <div className="admin-card">
            <h3>Amount Paid</h3>
            <div className="admin-metric-value">₹{(stats.totalPaid ?? 0).toLocaleString("en-IN")}</div>
            <div className="admin-pill">of ₹{(stats.totalAmount ?? 0).toLocaleString("en-IN")}</div>
          </div>
          <div className="admin-card admin-card--teal">
            <h3>Balance Due</h3>
            <div className="admin-metric-value" style={{ color: (stats.remainingBalance ?? 0) > 0 ? "#ef4444" : "#16a34a" }}>
              ₹{(stats.remainingBalance ?? 0).toLocaleString("en-IN")}
            </div>
            <div className="admin-pill">{stats.invoiceStatus || "—"}</div>
          </div>
        </div>
      ) : null}

      {/* My Batches with access control */}
      <MyBatchesSection accessStatus={accessStatus} />

      {/* Demo Courses with access control */}
      <DemoCoursesSection accessStatus={accessStatus} />
    </div>
  );
}