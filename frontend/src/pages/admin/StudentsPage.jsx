import useFetch from "../../hooks/useFetch";
import { getAllStudents, deleteStudent } from "../../api/students.api";

export default function StudentsPage() {
  const { data: students, loading, error, refetch } = useFetch(getAllStudents);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    try { await deleteStudent(id); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Students</h1><p>All registered students</p></div>
        <span className="admin-pill">{students?.length ?? 0} total</span>
      </div>

      {loading && <p style={{color:"#6b7280"}}>Loading students...</p>}
      {error && <p style={{color:"#ef4444"}}>{error}</p>}

      <div className="admin-list">
        {students?.map(s => (
          <div className="admin-list-item" key={s._id}>
            <div>
              <strong>{s.name}</strong>
              <div style={{color:"#6b7280",fontSize:12}}>{s.email} · {s.phone || "No phone"}</div>
              <div style={{color:"#9ca3af",fontSize:11}}>Joined {new Date(s.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span className="admin-pill" style={{background: s.isActive ? "#dcfce7" : "#fee2e2", color: s.isActive ? "#16a34a" : "#dc2626"}}>
                {s.isActive ? "Active" : "Inactive"}
              </span>
              <button onClick={() => handleDelete(s._id, s.name)}
                style={{padding:"4px 12px",borderRadius:6,border:"1px solid #ef4444",color:"#ef4444",background:"transparent",cursor:"pointer",fontSize:12}}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && !students?.length && <p style={{color:"#6b7280",padding:16}}>No students found.</p>}
      </div>
    </div>
  );
}
