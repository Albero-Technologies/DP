import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getFollowUps, createFollowUp, updateFollowUp } from "../../api/counselor.api";
import { getCounselorStudents } from "../../api/counselor.api";

const STATUS_STYLE = {
  PENDING:   { bg: "#fef9c3", text: "#92400e" },
  DONE:      { bg: "#dcfce7", text: "#166534" },
  CANCELLED: { bg: "#fee2e2", text: "#dc2626" },
};

const emptyForm = { studentId: "", name: "", phone: "", followUpDate: "", followUpTime: "", notes: "", status: "PENDING" };

export default function FollowUpsPage() {
  const { data: followups, loading, error, refetch } = useFetch(getFollowUps);
  const { data: students } = useFetch(getCounselorStudents);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    // Auto-fill name/phone when student selected
    if (e.target.name === "studentId" && students) {
      const s = students.find(s => s._id === e.target.value);
      if (s) { updated.name = s.name; updated.phone = s.phone || ""; }
    }
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await updateFollowUp(editing, form);
      else await createFollowUp(form);
      setForm(emptyForm); setEditing(null); setShowForm(false); refetch();
    } catch (err) { alert(err.response?.data?.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleEdit = (f) => {
    setForm({ studentId: f.studentId?._id || "", name: f.name || "", phone: f.phone || "", followUpDate: f.followUpDate?.slice(0, 10) || "", followUpTime: f.followUpTime || "", notes: f.notes || "", status: f.status });
    setEditing(f._id); setShowForm(true);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Follow-ups</h1><p>Schedule and track student follow-ups</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm); }}
          style={{ padding: "8px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          {showForm ? "Cancel" : "+ Schedule Follow-up"}
        </button>
      </div>

      {showForm && (
        <section className="admin-section" style={{ marginBottom: 24 }}>
          <h2>{editing ? "Edit Follow-up" : "New Follow-up"}</h2>
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <select name="studentId" value={form.studentId} onChange={handleChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}>
                <option value="">Select Student (or enter manually)</option>
                {students?.map(s => <option key={s._id} value={s._id}>{s.name} — {s.email}</option>)}
              </select>
            </div>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            <input name="followUpDate" type="date" value={form.followUpDate} onChange={handleChange} required
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            <input name="followUpTime" type="time" value={form.followUpTime} onChange={handleChange}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            <textarea name="notes" placeholder="Notes..." value={form.notes} onChange={handleChange} rows={2}
              style={{ gridColumn: "1/-1", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, resize: "vertical" }} />
            {editing && (
              <select name="status" value={form.status} onChange={handleChange}
                style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}>
                {["PENDING", "DONE", "CANCELLED"].map(s => <option key={s}>{s}</option>)}
              </select>
            )}
            <button type="submit" disabled={saving}
              style={{ gridColumn: "1/-1", padding: 10, background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
              {saving ? "Saving..." : editing ? "Update" : "Schedule Follow-up"}
            </button>
          </form>
        </section>
      )}

      {loading && <p style={{ color: "#6b7280" }}>Loading...</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      <div className="admin-list">
        {followups?.map(f => {
          const sc = STATUS_STYLE[f.status] || STATUS_STYLE.PENDING;
          const isToday = f.followUpDate && new Date(f.followUpDate).toDateString() === new Date().toDateString();
          return (
            <div className="admin-list-item" key={f._id}>
              <div>
                <strong>{f.studentId?.name || f.name}</strong>
                {isToday && <span style={{ marginLeft: 8, fontSize: 11, background: "#fef9c3", color: "#92400e", padding: "2px 8px", borderRadius: 99 }}>TODAY</span>}
                <div style={{ color: "#6b7280", fontSize: 12 }}>{f.phone} {f.followUpTime ? `· ${f.followUpTime}` : ""}</div>
                {f.notes && <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 2 }}>{f.notes}</div>}
              </div>
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{f.followUpDate?.slice(0, 10)}</div>
                <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.text }}>{f.status}</span>
                <button onClick={() => handleEdit(f)}
                  style={{ padding: "3px 10px", borderRadius: 6, border: "1px solid #6366f1", color: "#6366f1", background: "transparent", cursor: "pointer", fontSize: 11 }}>Edit</button>
              </div>
            </div>
          );
        })}
        {!loading && !followups?.length && <p style={{ color: "#6b7280", padding: 16 }}>No follow-ups scheduled yet.</p>}
      </div>
    </div>
  );
}
