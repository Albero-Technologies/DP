import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getTrainerStudents } from "../../api/trainer.api";

export default function TrainerStudentsPage() {
  const { data: enrollments, loading, error } = useFetch(getTrainerStudents);
  const [search, setSearch] = useState("");
  const [filterBatch, setFilterBatch] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Unique batches for filter
  const batches = [...new Map(enrollments?.map(e => [e.batch?._id, e.batch]).filter(([k]) => k)).values()];

  const filtered = enrollments?.filter(e => {
    const matchSearch = !search || e.student?.name?.toLowerCase().includes(search.toLowerCase()) || e.student?.email?.toLowerCase().includes(search.toLowerCase());
    const matchBatch = filterBatch === "ALL" || e.batch?._id === filterBatch;
    const matchStatus = filterStatus === "ALL" || e.status === filterStatus;
    return matchSearch && matchBatch && matchStatus;
  });

  const activeCount = enrollments?.filter(e => e.status === "ACTIVE").length || 0;
  const completedCount = enrollments?.filter(e => e.status === "COMPLETED").length || 0;

  function getInitials(name = "") {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }

  const avatarColors = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>My Students</h1><p>All students across your assigned batches</p></div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="admin-pill" style={{ background: "#dcfce7", color: "#166534" }}>{activeCount} Active</span>
          <span className="admin-pill" style={{ background: "#dbeafe", color: "#1d4ed8" }}>{completedCount} Completed</span>
          <span className="admin-pill">{enrollments?.length ?? 0} Total</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, marginBottom: 20 }}>
        <input placeholder="🔍 Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
        <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}>
          <option value="ALL">All Batches</option>
          {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}>
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="DROPPED">Dropped</option>
        </select>
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading students...</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      {/* Student cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {filtered?.map((e, i) => {
          const color = avatarColors[i % avatarColors.length];
          return (
            <div key={e._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {getInitials(e.student?.name)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{e.student?.name}</div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>{e.student?.email}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #f3f4f6" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Batch</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{e.batch?.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {e.student?.phone && <div style={{ fontSize: 12, color: "#6b7280" }}>📞 {e.student.phone}</div>}
                  <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                    background: e.status === "ACTIVE" ? "#dcfce7" : e.status === "COMPLETED" ? "#dbeafe" : "#fee2e2",
                    color: e.status === "ACTIVE" ? "#166534" : e.status === "COMPLETED" ? "#1d4ed8" : "#dc2626" }}>
                    {e.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && !filtered?.length && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <p>{search || filterBatch !== "ALL" || filterStatus !== "ALL" ? "No students match your filters." : "No students in your batches yet."}</p>
        </div>
      )}
    </div>
  );
}