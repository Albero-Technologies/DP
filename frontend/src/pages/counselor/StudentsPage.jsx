import { useState, useEffect } from "react";
import API from "../../api/axiosInstance";

const inputStyle = {
  padding: "9px 12px", borderRadius: 8,
  border: "1px solid #e5e7eb", fontSize: 14,
  width: "100%", boxSizing: "border-box",
};

const ACCESS_COLORS = {
  ACTIVE:   { bg: "#dcfce7", color: "#166534" },
  TRIAL:    { bg: "#fef9c3", color: "#854d0e" },
  INACTIVE: { bg: "#f1f5f9", color: "#64748b" },
};

// ── Batch Assignment Modal ───────────────────────────────────
function BatchModal({ student, onClose, onRefetch }) {
  const [batches,    setBatches]    = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selected,   setSelected]   = useState([]);
  const [saving,     setSaving]     = useState(false);
  const [removing,   setRemoving]   = useState(null);
  const [error,      setError]      = useState("");

  useEffect(() => {
    Promise.all([
      API.get("/batches"),
      API.get(`/enrollments?studentId=${student._id}`),
    ]).then(([bRes, eRes]) => {
      setBatches(bRes.data.data || []);
      setEnrollments(eRes.data.data || []);
    }).catch(() => {});
  }, [student._id]);

  const enrolledBatchIds = new Set(enrollments.map(e =>
    e.batch?._id || e.batch
  ).filter(Boolean).map(String));

  const handleAssign = async () => {
    if (!selected.length) return;
    setSaving(true); setError("");
    try {
      await API.post(`/counselor/students/${student._id}/assign-batches`, {
        batchIds: selected,
      });
      setSelected([]);
      // Refresh enrollments
      const eRes = await API.get(`/enrollments?studentId=${student._id}`);
      setEnrollments(eRes.data.data || []);
      onRefetch();
    } catch (err) {
      setError(err?.response?.data?.message || "Assignment failed");
    } finally { setSaving(false); }
  };

  const handleRemove = async (batchId) => {
    if (!window.confirm("Remove student from this batch?")) return;
    setRemoving(batchId);
    try {
      await API.delete(`/counselor/students/${student._id}/batches/${batchId}`);
      setEnrollments(prev => prev.filter(e => String(e.batch?._id || e.batch) !== String(batchId)));
      onRefetch();
    } catch (err) {
      alert(err?.response?.data?.message || "Remove failed");
    } finally { setRemoving(null); }
  };

  const toggleSelect = (id) => {
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const availableBatches = batches.filter(b => !enrolledBatchIds.has(String(b._id)));

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "min(96vw,560px)", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Manage Batches</h2>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>{student.name}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>✕</button>
        </div>

        <div style={{ padding: "16px 20px" }}>

          {/* Currently enrolled batches */}
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 10px" }}>
            Assigned Batches ({enrollments.length})
          </h3>

          {enrollments.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 16 }}>No batches assigned yet.</p>
          ) : (
            <div style={{ marginBottom: 20 }}>
              {enrollments.map(e => {
                const batchId = e.batch?._id || e.batch;
                const batchName = e.batch?.name || "Batch";
                const courseName = e.batch?.course?.title || "";
                return (
                  <div key={String(batchId)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#f8fafc", borderRadius: 8, marginBottom: 6, border: "1px solid #e5e7eb" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{batchName}</p>
                      {courseName && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7280" }}>📚 {courseName}</p>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 100, background: "#dcfce7", color: "#166534" }}>
                        {e.status || "ACTIVE"}
                      </span>
                      <button
                        onClick={() => handleRemove(batchId)}
                        disabled={removing === batchId}
                        style={{ padding: "3px 8px", border: "1px solid #fecaca", color: "#dc2626", background: "#fff", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>
                        {removing === batchId ? "…" : "Remove"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Assign new batches */}
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 8px" }}>
            Assign to More Batches
          </h3>

          {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>{error}</p>}

          {availableBatches.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: 13 }}>All available batches are already assigned.</p>
          ) : (
            <>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                {availableBatches.map((b, idx) => (
                  <div key={b._id}
                    onClick={() => toggleSelect(b._id)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer", background: selected.includes(b._id) ? "#f0f4ff" : "#fff", borderBottom: idx < availableBatches.length - 1 ? "1px solid #f1f5f9" : "none", transition: "background 0.15s" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selected.includes(b._id) ? "#6366f1" : "#d1d5db"}`, background: selected.includes(b._id) ? "#6366f1" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {selected.includes(b._id) && <span style={{ color: "#fff", fontSize: 11, fontWeight: 900 }}>✓</span>}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#111827" }}>{b.name}</p>
                      <p style={{ margin: "1px 0 0", fontSize: 11, color: "#6b7280" }}>
                        {b.course?.title || "—"} · {b.enrolledCount}/{b.capacity} students
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAssign}
                disabled={saving || !selected.length}
                style={{ width: "100%", padding: "10px", background: selected.length ? "#6366f1" : "#e5e7eb", color: selected.length ? "#fff" : "#9ca3af", border: "none", borderRadius: 8, cursor: selected.length ? "pointer" : "default", fontWeight: 600, fontSize: 14 }}>
                {saving ? "Assigning…" : `Assign ${selected.length ? `(${selected.length} selected)` : ""}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Edit Student Modal ───────────────────────────────────────
function EditModal({ student, onClose, onSave }) {
  const [form,   setForm]   = useState({ name: student.name, email: student.email, phone: student.phone || "", fatherName: student.fatherName || "", address: student.address || "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const handleSave = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.newPassword) delete payload.newPassword;
      else payload.password = payload.newPassword;
      delete payload.newPassword;
      await API.put(`/students/${student._id}`, payload);
      onSave();
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    } finally { setSaving(false); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, padding: "24px", width: "min(94vw,460px)", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Edit Student</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>✕</button>
        </div>
        {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 10 }}>{error}</p>}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { name: "name",       label: "Full Name *",   required: true },
            { name: "email",      label: "Email *",       required: true, type: "email" },
            { name: "phone",      label: "Phone",         required: false },
            { name: "fatherName", label: "Father Name",   required: false },
            { name: "address",    label: "Address",       required: false },
          { name: "newPassword", label: "New Password (leave blank to keep)", required: false, type: "password" },
          ].map(f => (
            <div key={f.name}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 3 }}>{f.label}</label>
              <input type={f.type || "text"} value={form[f.name]} required={f.required}
                onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                style={inputStyle} />
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: "9px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13 }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              style={{ flex: 1, padding: "9px", border: "none", borderRadius: 8, background: "#6366f1", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function CounselorStudentsPage() {
  const [students,    setStudents]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [editStudent, setEditStudent] = useState(null);
  const [batchStudent, setBatchStudent] = useState(null);
  const [search,      setSearch]      = useState("");

  const fetchStudents = () => {
    setLoading(true);
    API.get("/counselor/students")
      .then(r => setStudents(r.data.data || []))
      .catch(err => setError(err?.response?.data?.message || "Something went wrong"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) ||
      s.phone?.includes(q) || s.studentId?.toLowerCase().includes(q);
  });

  return (
    <div>
      {editStudent && (
        <EditModal
          student={editStudent}
          onClose={() => setEditStudent(null)}
          onSave={() => { setEditStudent(null); fetchStudents(); }}
        />
      )}
      {batchStudent && (
        <BatchModal
          student={batchStudent}
          onClose={() => setBatchStudent(null)}
          onRefetch={fetchStudents}
        />
      )}

      <div className="admin-page-header">
        <div><h1>Students</h1><p>Students enrolled via your link</p></div>
        <span className="admin-pill">{students.length} students</span>
      </div>

      {/* Search */}
      <input
        placeholder="Search by name, email, phone, student ID…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, maxWidth: 380, marginBottom: 20 }}
      />

      {loading && <p style={{ color: "#6b7280" }}>Loading students…</p>}
      {error   && <p style={{ color: "#ef4444" }}>{error}</p>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "#9ca3af" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>👥</div>
          <p style={{ margin: 0 }}>
            {students.length === 0
              ? "No students yet. Share your enrollment link to get started."
              : "No students match your search."}
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(s => (
          <div key={s._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>

            {/* Avatar + info */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                {s.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <strong style={{ fontSize: 14, color: "#111827" }}>{s.name}</strong>
                  {/* Student ID badge */}
                  {s.studentId && (
                    <span style={{ fontSize: 11, fontWeight: 700, background: "#f1f5f9", color: "#475569", padding: "1px 7px", borderRadius: 4 }}>
                      {s.studentId}
                    </span>
                  )}
                  {/* Access status */}
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 100, ...(ACCESS_COLORS[s.accessStatus || "INACTIVE"]) }}>
                    {s.accessStatus || "INACTIVE"}
                  </span>
                </div>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
                  {s.email}{s.phone ? ` · ${s.phone}` : ""}
                </p>
                {s.fatherName && (
                  <p style={{ margin: "1px 0 0", fontSize: 11, color: "#9ca3af" }}>Father: {s.fatherName}</p>
                )}
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>
                  Joined {new Date(s.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
              <button
                onClick={() => setBatchStudent(s)}
                style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid #0ea5e9", color: "#0ea5e9", background: "#f0f9ff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                🗓 Batches
              </button>
              <button
                onClick={() => setEditStudent(s)}
                style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid #6366f1", color: "#6366f1", background: "#fff", cursor: "pointer", fontSize: 12 }}>
                ✏️ Edit
              </button>
              {/* NO Delete button — counselor cannot delete students */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}