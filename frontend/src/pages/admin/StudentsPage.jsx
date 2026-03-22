import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getStudentsByCounselor, deleteStudent } from "../../api/students.api";

const ACCESS_COLORS = {
  ACTIVE: { bg: "#dcfce7", color: "#16a34a" },
  TRIAL: { bg: "#fef9c3", color: "#854d0e" },
  INACTIVE: { bg: "#f1f5f9", color: "#64748b" },
};

export default function StudentsPage() {
  const { data, loading, error, refetch } = useFetch(getStudentsByCounselor);
  const [expanded, setExpanded] = useState({});   // counselorId → true/false
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCounselor = (id) =>
    setExpanded(p => ({ ...p, [id]: !p[id] }));

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    try { await deleteStudent(id); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const grouped = data?.grouped || [];
  const unassigned = data?.unassigned || [];
  const total = data?.totalStudents ?? 0;


  // Filter students by search
  const filterStudents = (students) => {
    if (!searchTerm.trim()) return students;
    const q = searchTerm.toLowerCase();
    return students.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.includes(q) ||
      s.studentId?.toLowerCase().includes(q)
    );
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="admin-page-header">
        <div>
          <h1>Students</h1>
          <p>All enrolled students grouped by counselor</p>
        </div>
        <span className="admin-pill">{total} total students</span>
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Search by name, email, phone, student ID…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, width: "100%", maxWidth: 400, boxSizing: "border-box" }}
        />
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading students…</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      {/* ── Counselor groups ── */}
      {grouped.map(group => {
        const filtered = filterStudents(group.students);
        if (searchTerm && filtered.length === 0) return null;
        const isOpen = expanded[group.counselor._id] ?? true;

        return (
          <div key={group.counselor._id} style={s.groupCard}>
            {/* Counselor header row */}
            <div
              style={s.groupHeader}
              onClick={() => toggleCounselor(group.counselor._id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Avatar */}
                <div style={s.avatar}>
                  {group.counselor.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={s.counselorName}>{group.counselor.name}</p>
                  <p style={s.counselorMeta}>{group.counselor.email}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={s.countBadge}>
                  {group.studentCount} {group.studentCount === 1 ? "student" : "students"}
                </span>
                <span style={{ color: "#94a3b8", fontSize: 18 }}>
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {/* Students list */}
            {isOpen && (
              <div>
                {filtered.length === 0 ? (
                  <p style={s.emptyMsg}>No students enrolled yet.</p>
                ) : (
                  filtered.map((s2, idx) => (
                    <div key={s2._id} style={{ ...s.studentRow, borderTop: idx === 0 ? "none" : "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                        <div style={s.studentAvatar}>
                          {s2.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={s.studentName}>{s2.name}</p>
                          <p style={s.studentMeta}>
                            {s2.email}
                            {s2.phone && ` · ${s2.phone}`}
                            {s2.studentId && (
                              <span style={s.idBadge}>{s2.studentId}</span>
                            )}
                          </p>
                          <p style={s.joinDate}>
                            Joined {new Date(s2.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <span style={{ ...s.accessBadge, ...(ACCESS_COLORS[s2.accessStatus || "INACTIVE"]) }}>
                          {s2.accessStatus || "INACTIVE"}
                        </span>
                        <button
                          onClick={() => handleDelete(s2._id, s2.name)}
                          style={s.deleteBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Unassigned students ── */}
      {unassigned.length > 0 && filterStudents(unassigned).length > 0 && (
        <div style={s.groupCard}>
          <div
            style={{ ...s.groupHeader, background: "#fefce8" }}
            onClick={() => toggleCounselor("__unassigned")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ ...s.avatar, background: "#f59e0b" }}>?</div>
              <div>
                <p style={s.counselorName}>Unassigned Students</p>
                <p style={s.counselorMeta}>Not linked to any counselor</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ ...s.countBadge, background: "#fef3c7", color: "#92400e" }}>
                {filterStudents(unassigned).length} students
              </span>
              <span style={{ color: "#94a3b8", fontSize: 18 }}>
                {(expanded["__unassigned"] ?? true) ? "▲" : "▼"}
              </span>
            </div>
          </div>

          {(expanded["__unassigned"] ?? true) && (
            <div>
              {filterStudents(unassigned).map((s2, idx) => (
                <div key={s2._id} style={{ ...s.studentRow, borderTop: idx === 0 ? "none" : "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                    <div style={s.studentAvatar}>{s2.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <p style={s.studentName}>{s2.name}</p>
                      <p style={s.studentMeta}>
                        {s2.email}
                        {s2.phone && ` · ${s2.phone}`}
                        {s2.studentId && <span style={s.idBadge}>{s2.studentId}</span>}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{ ...s.accessBadge, ...(ACCESS_COLORS[s2.accessStatus || "INACTIVE"]) }}>
                      {s2.accessStatus || "INACTIVE"}
                    </span>
                    <button onClick={() => handleDelete(s2._id, s2.name)} style={s.deleteBtn}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && grouped.length === 0 && unassigned.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <p>No students yet. Counselors will enroll students via their unique links.</p>
        </div>
      )}
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────
const s = {
  groupCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  groupHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 18px",
    background: "#f8fafc",
    cursor: "pointer",
    borderBottom: "1px solid #e5e7eb",
    userSelect: "none",
  },
  avatar: {
    width: 40, height: 40, borderRadius: "50%",
    background: "#6366f1", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 16, flexShrink: 0,
  },
  counselorName: { fontWeight: 700, fontSize: 14, color: "#111827", margin: 0 },
  counselorMeta: { fontSize: 12, color: "#6b7280", margin: "2px 0 0" },
  countBadge: {
    background: "#ede9fe", color: "#5b21b6",
    fontSize: 12, fontWeight: 700,
    padding: "3px 10px", borderRadius: 100,
  },
  studentRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 18px",
    transition: "background 0.15s",
  },
  studentAvatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "#e0e7ff", color: "#4338ca",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 13, flexShrink: 0,
  },
  studentName: { fontWeight: 600, fontSize: 13, color: "#111827", margin: 0 },
  studentMeta: { fontSize: 12, color: "#6b7280", margin: "2px 0 0" },
  joinDate: { fontSize: 11, color: "#9ca3af", margin: "2px 0 0" },
  idBadge: {
    marginLeft: 6, background: "#f1f5f9", color: "#475569",
    fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
  },
  accessBadge: {
    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 100,
  },
  deleteBtn: {
    padding: "4px 10px", borderRadius: 6,
    border: "1px solid #ef4444", color: "#ef4444",
    background: "transparent", cursor: "pointer", fontSize: 12,
  },
  emptyMsg: { padding: "16px 18px", color: "#9ca3af", fontSize: 13, margin: 0 },
};