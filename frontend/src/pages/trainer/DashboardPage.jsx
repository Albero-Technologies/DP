import { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import { getTrainerDashboard } from "../../api/reports.api";
import { getMyTrainerSessions } from "../../api/sessions.api";
import { getTrainerBatches } from "../../api/trainer.api";

export default function TrainerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTrainerDashboard(),
      getMyTrainerSessions(),
      getTrainerBatches(),
    ]).then(([s, sess, b]) => {
      setStats(s.data);
      setSessions(sess.data || []);
      setBatches(b.data || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const todaySessions = sessions.filter(s => s.sessionDate && new Date(s.sessionDate).toDateString() === now.toDateString());
  const upcomingSessions = sessions.filter(s => s.sessionDate && new Date(s.sessionDate) > now).slice(0, 5);
  const activeBatches = batches.filter(b => b.isActive);

  function getInitials(name = "") {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }

  return (
    <div>
      {/* Welcome header */}
      <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 16, padding: "24px 28px", color: "#fff", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Welcome back,</div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{user?.name} 👋</h1>
            <div style={{ opacity: 0.8, fontSize: 14, marginTop: 4 }}>Trainer Portal · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
          </div>
          {todaySessions.length > 0 && (
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "12px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{todaySessions.length}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>session{todaySessions.length > 1 ? "s" : ""} today</div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="admin-metrics">
          {[1,2,3,4].map(i => <div key={i} className="admin-card" style={{ opacity: 0.4 }}><h3>Loading...</h3><div className="admin-metric-value">—</div></div>)}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="admin-metrics" style={{ marginBottom: 24 }}>
            <div className="admin-card admin-card--indigo">
              <h3>Assigned Batches</h3>
              <div className="admin-metric-value">{stats?.totalAssignedBatches ?? 0}</div>
              <div className="admin-pill">{stats?.activeBatches ?? 0} active</div>
            </div>
            <div className="admin-card">
              <h3>Total Students</h3>
              <div className="admin-metric-value">{stats?.totalStudents ?? 0}</div>
              <div className="admin-pill">Across all batches</div>
            </div>
            <div className="admin-card admin-card--teal">
              <h3>Total Sessions</h3>
              <div className="admin-metric-value">{sessions.length}</div>
              <div className="admin-pill">{upcomingSessions.length} upcoming</div>
            </div>
            <div className="admin-card">
              <h3>Today's Sessions</h3>
              <div className="admin-metric-value" style={{ color: todaySessions.length > 0 ? "#6366f1" : "#9ca3af" }}>
                {todaySessions.length}
              </div>
              <div className="admin-pill">{todaySessions.length > 0 ? "Classes today!" : "No classes today"}</div>
            </div>
          </div>

          <div className="admin-grid-two">
            {/* Today's sessions */}
            <section className="admin-section">
              <h2>📍 Today's Schedule</h2>
              {todaySessions.length === 0 ? (
                <div style={{ color: "#9ca3af", fontSize: 13, padding: "16px 0" }}>No sessions scheduled for today.</div>
              ) : (
                todaySessions.map(s => (
                  <div key={s._id} style={{ padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ fontSize: 14 }}>{s.title}</strong>
                        <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>🕐 {s.startTime} – {s.endTime} · {s.batch?.name}</div>
                      </div>
                      {s.meetingLink && (
                        <a href={s.meetingLink} target="_blank" rel="noopener noreferrer"
                          style={{ padding: "5px 12px", background: "#6366f1", color: "#fff", borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                          Join →
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Active batches */}
            <section className="admin-section">
              <h2>📦 Active Batches</h2>
              {activeBatches.length === 0 ? (
                <div style={{ color: "#9ca3af", fontSize: 13, padding: "16px 0" }}>No active batches.</div>
              ) : (
                activeBatches.map(b => (
                  <div key={b._id} className="admin-list-item">
                    <div>
                      <strong>{b.name}</strong>
                      <div style={{ color: "#6b7280", fontSize: 12 }}>{b.course?.title} · {b.enrolledCount}/{b.capacity} students</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>ends {b.endDate?.slice(0,10)}</div>
                      <span className="admin-pill" style={{ background: "#dcfce7", color: "#166534", fontSize: 11 }}>Active</span>
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Upcoming sessions */}
            <section className="admin-section">
              <h2>🗓 Upcoming Sessions</h2>
              {upcomingSessions.length === 0 ? (
                <div style={{ color: "#9ca3af", fontSize: 13, padding: "16px 0" }}>No upcoming sessions.</div>
              ) : (
                upcomingSessions.map(s => (
                  <div key={s._id} className="admin-list-item">
                    <div>
                      <strong style={{ fontSize: 14 }}>{s.title}</strong>
                      <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
                        {new Date(s.sessionDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · {s.startTime}–{s.endTime}
                      </div>
                      <div style={{ color: "#9ca3af", fontSize: 11 }}>{s.batch?.name}</div>
                    </div>
                    {s.meetingLink && (
                      <a href={s.meetingLink} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>Join →</a>
                    )}
                  </div>
                ))
              )}
            </section>

            {/* Batch-wise student count */}
            {stats?.batchWiseStats?.length > 0 && (
              <section className="admin-section">
                <h2>👥 Students per Batch</h2>
                {batches.map(b => {
                  const bws = stats.batchWiseStats.find(x => x._id?.toString() === b._id?.toString());
                  const count = bws?.studentCount || 0;
                  const pct = b.capacity > 0 ? Math.round((count / b.capacity) * 100) : 0;
                  return (
                    <div key={b._id} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{b.name}</span>
                        <span style={{ color: "#6b7280" }}>{count}/{b.capacity}</span>
                      </div>
                      <div style={{ background: "#f3f4f6", borderRadius: 99, height: 7 }}>
                        <div style={{ background: "#6366f1", borderRadius: 99, height: 7, width: `${pct}%`, transition: "width 0.3s" }} />
                      </div>
                    </div>
                  );
                })}
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
}