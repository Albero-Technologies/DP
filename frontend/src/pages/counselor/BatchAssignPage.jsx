import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { getAllBatches } from "../../api/batches.api";
import { getAllTrainers } from "../../api/admin.api";
import { getSessionsByBatch, createSession, updateSession, deleteSession } from "../../api/sessions.api";
import API from "../../api/axiosInstance";

const emptySession = {
  title: "", description: "", sessionDate: "", startTime: "", endTime: "",
  meetingLink: "", isRecurring: false, trainerId: "",
};

const pill = (bg, text, label) => (
  <span style={{ padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: bg, color: text }}>{label}</span>
);

export default function BatchAssignPage() {
  const { data: batches, loading: batchLoading, refetch: refetchBatches } = useFetch(getAllBatches);
  const { data: trainers } = useFetch(getAllTrainers);

  const [selectedBatch,    setSelectedBatch]    = useState(null);
  const [sessions,         setSessions]         = useState([]);
  const [sessionsLoading,  setSessionsLoading]  = useState(false);
  const [showSessionForm,  setShowSessionForm]  = useState(false);
  const [editingSession,   setEditingSession]   = useState(null);
  const [sessionForm,      setSessionForm]      = useState(emptySession);
  const [saving,           setSaving]           = useState(false);
  const [assigning,        setAssigning]        = useState(false);
  const [selectedTrainers, setSelectedTrainers] = useState([]); // multi-trainer
  const [formError,        setFormError]        = useState("");

  useEffect(() => {
    if (!selectedBatch) return;
    setSessionsLoading(true);
    getSessionsByBatch(selectedBatch._id)
      .then(res => setSessions(res.data || []))
      .catch(() => setSessions([]))
      .finally(() => setSessionsLoading(false));
    // Pre-select existing trainers
    const existingIds = (selectedBatch.trainers?.length
      ? selectedBatch.trainers
      : selectedBatch.trainer ? [selectedBatch.trainer] : []
    ).map(t => t._id || t).filter(Boolean).map(String);
    setSelectedTrainers(existingIds);
  }, [selectedBatch]);

  // Toggle trainer checkbox
  const toggleTrainer = (id) => {
    setSelectedTrainers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAssignTrainers = async () => {
    if (!selectedTrainers.length) return alert("Select at least one trainer");
    setAssigning(true);
    try {
      await API.post(`/admin/batches/${selectedBatch._id}/trainers`, {
        trainerIds: selectedTrainers,
      });
      alert("✅ Trainers assigned successfully!");
      refetchBatches();
      setSelectedBatch(prev => ({
        ...prev,
        trainers: trainers?.filter(t => selectedTrainers.includes(t._id)),
        trainer:  trainers?.find(t => t._id === selectedTrainers[0]),
      }));
    } catch (err) { alert(err?.response?.data?.message || "Failed to assign trainers"); }
    finally { setAssigning(false); }
  };

  const handleSessionChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSessionForm(p => ({ ...p, [e.target.name]: val }));
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setFormError("");
    try {
      const payload = {
        ...sessionForm,
        batchId:   selectedBatch._id,
        trainerId: sessionForm.trainerId || selectedTrainers[0] || "",
      };
      if (editingSession) {
        await updateSession(editingSession._id, payload);
      } else {
        await createSession(payload);
      }
      const res = await getSessionsByBatch(selectedBatch._id);
      setSessions(res.data || []);
      setShowSessionForm(false);
      setSessionForm(emptySession);
      setEditingSession(null);
    } catch (err) { setFormError(err?.response?.data?.message || "Failed to save session"); }
    finally { setSaving(false); }
  };

  const handleEditSession = (s) => {
    setSessionForm({
      title:       s.title,
      description: s.description || "",
      sessionDate: s.sessionDate?.slice(0, 10) || "",
      startTime:   s.startTime,
      endTime:     s.endTime,
      meetingLink: s.meetingLink || "",
      isRecurring: s.isRecurring || false,
      trainerId:   s.trainer?._id || s.trainer || "",
    });
    setEditingSession(s);
    setShowSessionForm(true);
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await deleteSession(id);
      setSessions(prev => prev.filter(s => s._id !== id));
    } catch (err) { alert(err?.response?.data?.message || "Delete failed"); }
  };

  // Trainers available for this batch (assigned trainers)
  const batchTrainers = trainers?.filter(t =>
    selectedTrainers.includes(t._id) || selectedTrainers.includes(String(t._id))
  ) || [];

  const upcomingSessions = sessions.filter(s => new Date(s.sessionDate) >= new Date());
  const pastSessions     = sessions.filter(s => new Date(s.sessionDate) <  new Date());

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Batch & Sessions</h1>
          <p>Assign trainers to batches and schedule sessions</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>

        {/* ── LEFT: Batch list ── */}
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            Select Batch
          </h3>
          {batchLoading && <p style={{ color: "#6b7280", fontSize: 13 }}>Loading…</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {batches?.map(b => {
              const trainerList = b.trainers?.length ? b.trainers : (b.trainer ? [b.trainer] : []);
              return (
                <div key={b._id}
                  onClick={() => { setSelectedBatch(b); setShowSessionForm(false); setSessionForm(emptySession); setEditingSession(null); }}
                  style={{ background: selectedBatch?._id === b._id ? "#eff6ff" : "#fff", border: `2px solid ${selectedBatch?._id === b._id ? "#6366f1" : "#e5e7eb"}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{b.course?.title || "—"}</div>
                  <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
                    {trainerList.length > 0
                      ? trainerList.map(t => (
                          <span key={t._id || t} style={{ padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#166534" }}>
                            👤 {t.name || "Trainer"}
                          </span>
                        ))
                      : <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "#fee2e2", color: "#dc2626" }}>No trainer</span>
                    }
                    {pill(b.isActive ? "#dbeafe" : "#f3f4f6", b.isActive ? "#1d4ed8" : "#6b7280", b.isActive ? "Active" : "Ended")}
                  </div>
                </div>
              );
            })}
            {!batchLoading && !batches?.length && (
              <p style={{ color: "#6b7280", fontSize: 13 }}>No batches found.</p>
            )}
          </div>
        </div>

        {/* ── RIGHT ── */}
        {selectedBatch ? (
          <div>
            {/* Batch header */}
            <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 14, padding: "20px 24px", color: "#fff", marginBottom: 20 }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>{selectedBatch.name}</h2>
              <div style={{ opacity: 0.85, fontSize: 14 }}>
                {selectedBatch.course?.title} · {selectedBatch.enrolledCount}/{selectedBatch.capacity} students
              </div>
              <div style={{ opacity: 0.75, fontSize: 13, marginTop: 4 }}>
                {selectedBatch.startDate?.slice(0,10)} → {selectedBatch.endDate?.slice(0,10)}
              </div>
            </div>

            {/* ── Assign Multiple Trainers ── */}
            <section className="admin-section" style={{ marginBottom: 20 }}>
              <h2>👤 Assign Trainers</h2>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 12px" }}>
                Select one or more trainers for this batch:
              </p>

              {/* Trainer checkbox list */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
                {trainers?.length === 0 && (
                  <p style={{ padding: "12px 14px", color: "#9ca3af", fontSize: 13 }}>No trainers available. Create trainers from Staff page.</p>
                )}
                {trainers?.map((t, idx) => (
                  <div key={t._id}
                    onClick={() => toggleTrainer(t._id)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", cursor: "pointer", background: selectedTrainers.includes(t._id) ? "#f0f4ff" : "#fff", borderBottom: idx < trainers.length - 1 ? "1px solid #f1f5f9" : "none", transition: "background 0.12s" }}>
                    {/* Checkbox */}
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selectedTrainers.includes(t._id) ? "#6366f1" : "#d1d5db"}`, background: selectedTrainers.includes(t._id) ? "#6366f1" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {selectedTrainers.includes(t._id) && <span style={{ color: "#fff", fontSize: 11, fontWeight: 900 }}>✓</span>}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111827" }}>{t.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{t.email}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleAssignTrainers} disabled={assigning || !selectedTrainers.length}
                style={{ padding: "9px 22px", background: selectedTrainers.length ? "#6366f1" : "#e5e7eb", color: selectedTrainers.length ? "#fff" : "#9ca3af", border: "none", borderRadius: 8, cursor: selectedTrainers.length ? "pointer" : "default", fontWeight: 600, fontSize: 14 }}>
                {assigning ? "Assigning…" : `Assign ${selectedTrainers.length ? `(${selectedTrainers.length} selected)` : ""}`}
              </button>

              {/* Currently assigned */}
              {batchTrainers.length > 0 && (
                <div style={{ marginTop: 10, padding: "8px 14px", background: "#f0fdf4", borderRadius: 8, fontSize: 13, color: "#166534", borderLeft: "3px solid #16a34a" }}>
                  ✅ Assigned: {batchTrainers.map(t => <strong key={t._id}>{t.name}</strong>).reduce((prev, curr) => [prev, ", ", curr])}
                </div>
              )}
            </section>

            {/* ── Sessions ── */}
            <section className="admin-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>🗓 Session Schedule</h2>
                <button onClick={() => { setShowSessionForm(!showSessionForm); setEditingSession(null); setSessionForm(emptySession); }}
                  style={{ padding: "7px 16px", background: showSessionForm ? "#f3f4f6" : "#6366f1", color: showSessionForm ? "#374151" : "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                  {showSessionForm ? "Cancel" : "+ Add Session"}
                </button>
              </div>

              {/* Session Form */}
              {showSessionForm && (
                <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20, marginBottom: 20 }}>
                  <h3 style={{ margin: "0 0 14px", fontSize: 15 }}>{editingSession ? "Edit Session" : "New Session"}</h3>
                  {formError && <p style={{ color: "#ef4444", fontSize: 13, margin: "0 0 10px" }}>{formError}</p>}
                  <form onSubmit={handleSessionSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <input name="title" placeholder="Session Title (e.g. HTML Basics)" value={sessionForm.title} onChange={handleSessionChange} required
                      style={{ gridColumn: "1/-1", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
                    <input name="description" placeholder="Description (optional)" value={sessionForm.description} onChange={handleSessionChange}
                      style={{ gridColumn: "1/-1", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />

                    <div>
                      <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4, fontWeight: 600 }}>Date *</label>
                      <input name="sessionDate" type="date" value={sessionForm.sessionDate} onChange={handleSessionChange} required
                        style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
                    </div>

                    {/* ── Select Trainer for this session ── */}
                    <div>
                      <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4, fontWeight: 600 }}>Select Trainer *</label>
                      <select name="trainerId" value={sessionForm.trainerId} onChange={handleSessionChange} required
                        style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}>
                        <option value="">Choose trainer…</option>
                        {/* Show assigned trainers first, then all */}
                        {batchTrainers.length > 0 ? (
                          <>
                            <optgroup label="Assigned to this batch">
                              {batchTrainers.map(t => (
                                <option key={t._id} value={t._id}>{t.name} — {t.email}</option>
                              ))}
                            </optgroup>
                            {trainers?.filter(t => !selectedTrainers.includes(t._id)).length > 0 && (
                              <optgroup label="Other trainers">
                                {trainers.filter(t => !selectedTrainers.includes(t._id)).map(t => (
                                  <option key={t._id} value={t._id}>{t.name} — {t.email}</option>
                                ))}
                              </optgroup>
                            )}
                          </>
                        ) : (
                          trainers?.map(t => (
                            <option key={t._id} value={t._id}>{t.name} — {t.email}</option>
                          ))
                        )}
                      </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4, fontWeight: 600 }}>Start Time *</label>
                        <input name="startTime" type="time" value={sessionForm.startTime} onChange={handleSessionChange} required
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4, fontWeight: 600 }}>End Time *</label>
                        <input name="endTime" type="time" value={sessionForm.endTime} onChange={handleSessionChange} required
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
                      </div>
                    </div>

                    <input name="meetingLink" placeholder="Google Meet / Zoom link (optional)" value={sessionForm.meetingLink} onChange={handleSessionChange}
                      style={{ gridColumn: "1/-1", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />

                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", gridColumn: "1/-1", cursor: "pointer" }}>
                      <input name="isRecurring" type="checkbox" checked={sessionForm.isRecurring} onChange={handleSessionChange} style={{ width: 16, height: 16 }} />
                      Mark as recurring weekly session
                    </label>

                    <button type="submit" disabled={saving}
                      style={{ gridColumn: "1/-1", padding: "10px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                      {saving ? "Saving..." : editingSession ? "Update Session" : "Schedule Session"}
                    </button>
                  </form>
                </div>
              )}

              {sessionsLoading && <p style={{ color: "#6b7280", fontSize: 13 }}>Loading sessions…</p>}

              {!sessionsLoading && sessions.length === 0 && !showSessionForm && (
                <div style={{ textAlign: "center", padding: "30px 20px", color: "#9ca3af" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🗓</div>
                  <p style={{ fontSize: 13 }}>No sessions scheduled. Click <strong>+ Add Session</strong> to create one.</p>
                </div>
              )}

              {upcomingSessions.length > 0 && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, margin: "16px 0 8px" }}>
                    Upcoming ({upcomingSessions.length})
                  </div>
                  {upcomingSessions.map(s => <SessionCard key={s._id} session={s} onEdit={handleEditSession} onDelete={handleDeleteSession} />)}
                </>
              )}

              {pastSessions.length > 0 && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, margin: "16px 0 8px" }}>
                    Past ({pastSessions.length})
                  </div>
                  {pastSessions.map(s => <SessionCard key={s._id} session={s} onEdit={handleEditSession} onDelete={handleDeleteSession} past />)}
                </>
              )}
            </section>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#9ca3af", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 52 }}>👈</div>
            <p style={{ fontSize: 15 }}>Select a batch to manage its trainers and sessions</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SessionCard({ session, onEdit, onDelete, past }) {
  const dateStr = session.sessionDate
    ? new Date(session.sessionDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : "—";
  return (
    <div style={{ background: past ? "#fafafa" : "#fff", border: `1px solid ${past ? "#f3f4f6" : "#e5e7eb"}`, borderRadius: 10, padding: "14px 16px", marginBottom: 10, opacity: past ? 0.7 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <strong style={{ fontSize: 14 }}>{session.title}</strong>
            {session.isRecurring && (
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: "#ede9fe", color: "#7c3aed", fontWeight: 700 }}>🔁 RECURRING</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#6b7280", flexWrap: "wrap" }}>
            <span>📅 {dateStr}</span>
            <span>🕐 {session.startTime} – {session.endTime}</span>
            {session.trainer && <span>👤 {session.trainer.name}</span>}
          </div>
          {session.description && (
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{session.description}</div>
          )}
          {session.meetingLink && (
            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: "#6366f1", marginTop: 4, display: "inline-block" }}>
              🔗 Join Meeting
            </a>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 12 }}>
          <button onClick={() => onEdit(session)}
            style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #6366f1", color: "#6366f1", background: "transparent", cursor: "pointer", fontSize: 12 }}>
            Edit
          </button>
          <button onClick={() => onDelete(session._id)}
            style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #ef4444", color: "#ef4444", background: "transparent", cursor: "pointer", fontSize: 12 }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}