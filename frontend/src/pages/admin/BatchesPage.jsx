import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getAllBatches, createBatch, updateBatch, deleteBatch } from "../../api/batches.api";
import { getAllCourses } from "../../api/courses.api";

const empty = { name: "", course: "", startDate: "", endDate: "", capacity: "" };

export default function BatchesPage() {
  const { data: batches, loading, error, refetch } = useFetch(getAllBatches);
  const { data: courses } = useFetch(getAllCourses);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setFormError("");
    try {
      if (editing) { await updateBatch(editing, form); }
      else { await createBatch(form); }
      setForm(empty); setEditing(null); setShowForm(false); refetch();
    } catch (err) { setFormError(err.response?.data?.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleEdit = (b) => {
    setForm({ name: b.name, course: b.course?._id || b.course, startDate: b.startDate?.slice(0,10), endDate: b.endDate?.slice(0,10), capacity: b.capacity });
    setEditing(b._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this batch?")) return;
    try { await deleteBatch(id); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Batches</h1><p>Manage training batches</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty); }}
          style={{cursor:"pointer",padding:"8px 16px",background:"#6366f1",color:"#fff",border:"none",borderRadius:8}}>
          {showForm ? "Cancel" : "+ Add Batch"}
        </button>
      </div>

      {showForm && (
        <section className="admin-section" style={{marginBottom:24}}>
          <h2>{editing ? "Edit Batch" : "New Batch"}</h2>
          {formError && <p style={{color:"#ef4444"}}>{formError}</p>}
          <form onSubmit={handleSubmit} style={{display:"grid",gap:12}}>
            <input name="name" placeholder="Batch Name" value={form.name} onChange={handleChange} required
              style={{padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:14}} />
            <select name="course" value={form.course} onChange={handleChange} required
              style={{padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:14}}>
              <option value="">Select Course</option>
              {courses?.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required
              style={{padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:14}} />
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required
              style={{padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:14}} />
            <input name="capacity" type="number" placeholder="Capacity" value={form.capacity} onChange={handleChange} required
              style={{padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:14}} />
            <button type="submit" disabled={saving}
              style={{padding:"10px 20px",background:"#6366f1",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",width:"fit-content"}}>
              {saving ? "Saving..." : editing ? "Update Batch" : "Create Batch"}
            </button>
          </form>
        </section>
      )}

      {loading && <p style={{color:"#6b7280"}}>Loading batches...</p>}
      {error && <p style={{color:"#ef4444"}}>{error}</p>}

      <div className="admin-list">
        {batches?.map(b => (
          <div className="admin-list-item" key={b._id}>
            <div>
              <strong>{b.name}</strong>
              <div style={{color:"#6b7280",fontSize:12}}>
                {b.course?.title || "—"} · {b.enrolledCount}/{b.capacity} students · {b.isActive ? "Active" : "Inactive"}
              </div>
              <div style={{color:"#9ca3af",fontSize:11}}>
                {b.startDate?.slice(0,10)} → {b.endDate?.slice(0,10)}
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={() => handleEdit(b)}
                style={{padding:"4px 12px",borderRadius:6,border:"1px solid #6366f1",color:"#6366f1",background:"transparent",cursor:"pointer",fontSize:12}}>Edit</button>
              <button onClick={() => handleDelete(b._id)}
                style={{padding:"4px 12px",borderRadius:6,border:"1px solid #ef4444",color:"#ef4444",background:"transparent",cursor:"pointer",fontSize:12}}>Delete</button>
            </div>
          </div>
        ))}
        {!loading && !batches?.length && <p style={{color:"#6b7280",padding:16}}>No batches yet.</p>}
      </div>
    </div>
  );
}
