import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getStudentsWithEnrollment, createCounselorStudent, updateCounselorStudent, deleteCounselorStudent, enrollStudentToBatch } from "../../api/counselor.api";
import { getAllBatches } from "../../api/batches.api";

const emptyForm = { name: "", email: "", password: "student123", phone: "" };
const TAB_STYLE = (active) => ({
  padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
  background: active ? "#6366f1" : "#f3f4f6", color: active ? "#fff" : "#374151",
});

export default function CounselorStudentsPage() {
  const { data: students, loading, error, refetch } = useFetch(getStudentsWithEnrollment);
  const { data: batches } = useFetch(getAllBatches);
  const [tab, setTab] = useState("new"); // "new" | "enrolled"
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [enrollModal, setEnrollModal] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const newStudents = students?.filter(s => !s.isEnrolled) || [];
  const enrolledStudents = students?.filter(s => s.isEnrolled) || [];
  const displayStudents = tab === "new" ? newStudents : enrolledStudents;

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setFormError("");
    try {
      if (editing) await updateCounselorStudent(editing, form);
      else await createCounselorStudent(form);
      setForm(emptyForm); setEditing(null); setShowForm(false); refetch();
    } catch (err) { setFormError(err.response?.data?.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleEdit = (s) => {
    setForm({ name: s.name, email: s.email, password: "", phone: s.phone || "" });
    setEditing(s._id); setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"?`)) return;
    try { await deleteCounselorStudent(id); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const handleEnroll = async () => {
    if (!selectedBatch) return alert("Select a batch first");
    setEnrolling(true);
    try {
      await enrollStudentToBatch({ studentId: enrollModal, batchId: selectedBatch });
      alert("Student enrolled successfully!");
      setEnrollModal(null); setSelectedBatch(""); refetch();
    } catch (err) { alert(err.response?.data?.message || "Enrollment failed"); }
    finally { setEnrolling(false); }
  };

  return (
    <div>
      {/* Enroll Modal */}
      {enrollModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setEnrollModal(null)}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 380, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 6px", fontSize: 17 }}>Enroll Student in Batch</h3>
            <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 16px" }}>Select a batch to assign this student to</p>
            <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, marginBottom: 16 }}>
              <option value="">Select Batch...</option>
              {batches?.map(b => (
                <option key={b._id} value={b._id}>
                  {b.name} — {b.course?.title || "Unknown course"} ({b.enrolledCount}/{b.capacity})
                </option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleEnroll} disabled={enrolling}
                style={{ flex: 1, padding: 10, background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                {enrolling ? "Enrolling..." : "Confirm Enroll"}
              </button>
              <button onClick={() => setEnrollModal(null)}
                style={{ flex: 1, padding: 10, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div><h1>Students</h1><p>Manage student accounts and enrollments</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm); }}
          style={{ padding: "8px 18px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
          {showForm ? "Cancel" : "+ Add Student"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <section className="admin-section" style={{ marginBottom: 24 }}>
          <h2>{editing ? "Edit Student" : "New Student"}</h2>
          {formError && <p style={{ color: "#ef4444", fontSize: 13 }}>{formError}</p>}
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            <input name="password" type="password" placeholder={editing ? "New password (leave blank to keep)" : "Password (default: student123)"}
              value={form.password} onChange={handleChange}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            <button type="submit" disabled={saving}
              style={{ gridColumn: "1/-1", padding: 10, background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
              {saving ? "Saving..." : editing ? "Update Student" : "Create Student"}
            </button>
          </form>
        </section>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button style={TAB_STYLE(tab === "new")} onClick={() => setTab("new")}>
          🆕 New Students ({newStudents.length})
        </button>
        <button style={TAB_STYLE(tab === "enrolled")} onClick={() => setTab("enrolled")}>
          ✅ Assigned to Batch ({enrolledStudents.length})
        </button>
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading students...</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      {/* Student list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {displayStudents.map(s => (
          <div key={s._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>
                  {s.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <strong style={{ fontSize: 15 }}>{s.name}</strong>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>{s.email} {s.phone ? `· ${s.phone}` : ""}</div>
                </div>
              </div>

              {/* Show enrollments for enrolled tab */}
              {tab === "enrolled" && s.enrollments?.length > 0 && (
                <div style={{ marginTop: 8, marginLeft: 46 }}>
                  {s.enrollments.map((e, i) => (
                    <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", borderRadius: 6, padding: "3px 10px", marginRight: 8, marginBottom: 4, fontSize: 12 }}>
                      <span style={{ color: "#6366f1", fontWeight: 600 }}>📚 {e.batch?.course?.title || "Course"}</span>
                      <span style={{ color: "#6b7280" }}>→ {e.batch?.name}</span>
                      <span style={{ padding: "1px 6px", borderRadius: 4, background: e.status === "ACTIVE" ? "#dcfce7" : "#fee2e2", color: e.status === "ACTIVE" ? "#166534" : "#dc2626", fontWeight: 600 }}>{e.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {tab === "new" && (
                <button onClick={() => setEnrollModal(s._id)}
                  style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid #0ea5e9", color: "#0ea5e9", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  + Enroll
                </button>
              )}
              <button onClick={() => handleEdit(s)}
                style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid #6366f1", color: "#6366f1", background: "transparent", cursor: "pointer", fontSize: 12 }}>
                Edit
              </button>
              <button onClick={() => handleDelete(s._id, s.name)}
                style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid #ef4444", color: "#ef4444", background: "transparent", cursor: "pointer", fontSize: 12 }}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && !displayStudents.length && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#6b7280" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>{tab === "new" ? "🆕" : "✅"}</div>
            <p>{tab === "new" ? "No new unassigned students." : "No students assigned to batches yet."}</p>
          </div>
        )}
      </div>
    </div>
  );
}