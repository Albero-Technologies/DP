import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "../../api/courses.api";

const empty = { title: "", description: "", durationInMonths: "", fees: "", youtubeLink: "" };

// Robust YouTube ID extractor — handles youtu.be, watch?v=, embed/, ?si= tracking params
function getYouTubeId(url) {
  if (!url) return null;
  try {
    // Handle youtu.be/ID?si=...
    const shortMatch = url.match(/youtu\.be\/([^?&\n#]+)/);
    if (shortMatch) return shortMatch[1];
    // Handle youtube.com/watch?v=ID&...
    const watchMatch = url.match(/[?&]v=([^?&\n#]+)/);
    if (watchMatch) return watchMatch[1];
    // Handle youtube.com/embed/ID
    const embedMatch = url.match(/embed\/([^?&\n#]+)/);
    if (embedMatch) return embedMatch[1];
  } catch {}
  return null;
}

export default function CoursesPage() {
  const { data: courses, loading, error, refetch } = useFetch(getAllCourses);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setFormError("");
    try {
      if (editing) await updateCourse(editing, form);
      else await createCourse(form);
      setForm(empty); setEditing(null); setShowForm(false);
      refetch();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save course");
    } finally { setSaving(false); }
  };

  const handleEdit = (course) => {
    setForm({
      title: course.title,
      description: course.description || "",
      durationInMonths: course.durationInMonths,
      fees: course.fees,
      youtubeLink: course.youtubeLink || "",
    });
    setEditing(course._id); setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try { await deleteCourse(id); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const previewId = getYouTubeId(form.youtubeLink);

  return (
    <div>
      {/* ── Video Modal ── */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ width: "min(90vw,900px)", aspectRatio: "16/9", borderRadius: 14, overflow: "hidden", position: "relative", boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
            <button onClick={() => setActiveVideo(null)}
              style={{ position: "absolute", top: 10, right: 14, color: "#fff", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 34, height: 34, fontSize: 18, cursor: "pointer", zIndex: 10, lineHeight: "34px" }}>✕</button>
            <iframe width="100%" height="100%"
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
              title="Course Video" frameBorder="0" allowFullScreen allow="autoplay"
              style={{ display: "block" }} />
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div><h1>Courses</h1><p>Manage all training programs</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty); }}
          style={{ padding: "8px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
          {showForm ? "Cancel" : "+ Add Course"}
        </button>
      </div>

      {/* ── Form ── */}
      {showForm && (
        <section className="admin-section" style={{ marginBottom: 28 }}>
          <h2>{editing ? "Edit Course" : "New Course"}</h2>
          {formError && <p style={{ color: "#ef4444", marginBottom: 10, fontSize: 13 }}>{formError}</p>}
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <input name="title" placeholder="Course Title" value={form.title} onChange={handleChange} required
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            <input name="description" placeholder="Short Description" value={form.description} onChange={handleChange}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input name="durationInMonths" type="number" placeholder="Duration (months)" value={form.durationInMonths} onChange={handleChange} required
                style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
              <input name="fees" type="number" placeholder="Fees (₹)" value={form.fees} onChange={handleChange} required
                style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            </div>

            {/* YouTube — required */}
            <div>
              <input name="youtubeLink" placeholder="YouTube Link (required) — e.g. https://youtu.be/abc123"
                value={form.youtubeLink} onChange={handleChange} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${previewId ? "#6366f1" : form.youtubeLink ? "#ef4444" : "#e5e7eb"}`, fontSize: 14, boxSizing: "border-box" }} />
              {form.youtubeLink && !previewId && (
                <p style={{ color: "#ef4444", fontSize: 12, margin: "4px 0 0" }}>⚠ Paste a valid YouTube URL (youtu.be/... or youtube.com/watch?v=...)</p>
              )}
            </div>

            {/* Live preview */}
            {previewId && (
              <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/9", maxWidth: 440, border: "2px solid #6366f1", boxShadow: "0 2px 12px rgba(99,102,241,0.2)" }}>
                <iframe width="100%" height="100%"
                  src={`https://www.youtube.com/embed/${previewId}`}
                  title="Preview" frameBorder="0" allowFullScreen style={{ display: "block" }} />
              </div>
            )}

            <button type="submit" disabled={saving || (form.youtubeLink && !previewId)}
              style={{ padding: "10px 24px", background: saving ? "#a5b4fc" : "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer", width: "fit-content", fontWeight: 600 }}>
              {saving ? "Saving..." : editing ? "Update Course" : "Create Course"}
            </button>
          </form>
        </section>
      )}

      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: "#f3f4f6", borderRadius: 12, height: 280, animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      )}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      {/* ── Course Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20, marginTop: 8 }}>
        {courses?.map(course => {
          const vid = getYouTubeId(course.youtubeLink);
          return (
            <div key={course._id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.15)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"}>

              {/* Thumbnail — shows YouTube thumbnail if video exists */}
              <div style={{ position: "relative", aspectRatio: "16/9", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", cursor: vid ? "pointer" : "default", overflow: "hidden" }}
                onClick={() => vid && setActiveVideo(vid)}>
                {vid ? (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`}
                      alt={course.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                    {/* Play button overlay */}
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.15)" }}>
                      <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.92)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>▶</div>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 8 }}>
                    <span style={{ fontSize: 40, opacity: 0.5 }}>📚</span>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>No video</span>
                  </div>
                )}
              </div>

              {/* Card content */}
              <div style={{ padding: "16px 18px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#111827" }}>{course.title}</h3>
                {course.description && (
                  <p style={{ margin: "0 0 10px", fontSize: 12, color: "#6b7280", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {course.description}
                  </p>
                )}
                <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
                  <span>⏱ {course.durationInMonths} months</span>
                  <span>💰 ₹{course.fees?.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {vid && (
                    <button onClick={() => setActiveVideo(vid)}
                      style={{ padding: "5px 14px", borderRadius: 7, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                      ▶ Watch
                    </button>
                  )}
                  <button onClick={() => handleEdit(course)}
                    style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid #6366f1", color: "#6366f1", background: "#fff", cursor: "pointer", fontSize: 12 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(course._id)}
                    style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid #ef4444", color: "#ef4444", background: "#fff", cursor: "pointer", fontSize: 12 }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && !courses?.length && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <p>No courses yet. Click <strong>+ Add Course</strong> to create your first one!</p>
        </div>
      )}
    </div>
  );
}