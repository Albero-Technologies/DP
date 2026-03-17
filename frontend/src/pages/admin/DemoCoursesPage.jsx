import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getAllDemoCourses, createDemoCourse, updateDemoCourse, deleteDemoCourse } from "../../api/demo-courses.api";

const empty = { title: "", description: "", youtubeLink: "" };

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/);
  return m ? m[1] : null;
}

export default function DemoCoursesPage() {
  const { data: courses, loading, error, refetch } = useFetch(getAllDemoCourses);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setFormError("");
    try {
      if (editing) await updateDemoCourse(editing, form);
      else await createDemoCourse(form);
      setForm(empty); setEditing(null); setShowForm(false); refetch();
    } catch (err) { setFormError(err.response?.data?.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleEdit = (c) => {
    setForm({ title: c.title, description: c.description || "", youtubeLink: c.youtubeLink });
    setEditing(c._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this demo course?")) return;
    try { await deleteDemoCourse(id); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Demo Courses</h1><p>Free preview courses visible to all students</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty); }}
          style={{ padding: "8px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          {showForm ? "Cancel" : "+ Add Demo Course"}
        </button>
      </div>

      {showForm && (
        <section className="admin-section" style={{ marginBottom: 24 }}>
          <h2>{editing ? "Edit Demo Course" : "New Demo Course"}</h2>
          {formError && <p style={{ color: "#ef4444" }}>{formError}</p>}
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <input name="title" placeholder="Course Title" value={form.title} onChange={handleChange} required
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            <textarea name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} rows={2}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, resize: "vertical" }} />
            <input name="youtubeLink" placeholder="YouTube Link (e.g. https://youtube.com/watch?v=...)" value={form.youtubeLink} onChange={handleChange} required
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            {form.youtubeLink && getYouTubeId(form.youtubeLink) && (
              <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "16/9", maxWidth: 400 }}>
                <iframe width="100%" height="100%"
                  src={`https://www.youtube.com/embed/${getYouTubeId(form.youtubeLink)}`}
                  title="Preview" frameBorder="0" allowFullScreen />
              </div>
            )}
            <button type="submit" disabled={saving}
              style={{ padding: "10px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", width: "fit-content" }}>
              {saving ? "Saving..." : editing ? "Update" : "Create Demo Course"}
            </button>
          </form>
        </section>
      )}

      {loading && <p style={{ color: "#6b7280" }}>Loading...</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20, marginTop: 8 }}>
        {courses?.map(c => {
          const vid = getYouTubeId(c.youtubeLink);
          return (
            <div key={c._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              {vid && (
                <div style={{ aspectRatio: "16/9", background: "#000" }}>
                  <img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt={c.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 15 }}>{c.title}</h3>
                {c.description && <p style={{ margin: "0 0 12px", fontSize: 12, color: "#6b7280" }}>{c.description}</p>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleEdit(c)}
                    style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #6366f1", color: "#6366f1", background: "transparent", cursor: "pointer", fontSize: 12 }}>Edit</button>
                  <button onClick={() => handleDelete(c._id)}
                    style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #ef4444", color: "#ef4444", background: "transparent", cursor: "pointer", fontSize: 12 }}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!loading && !courses?.length && <p style={{ color: "#6b7280", padding: 16 }}>No demo courses yet.</p>}
    </div>
  );
}
