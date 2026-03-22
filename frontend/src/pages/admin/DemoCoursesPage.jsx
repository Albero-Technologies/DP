import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getAllDemoCourses, createDemoCourse, updateDemoCourse, deleteDemoCourse } from "../../api/demo-courses.api";
import API from "../../api/axiosInstance";

const empty      = { title: "", description: "", youtubeLink: "" };
const emptyVideo = { title: "", url: "" };

function getYouTubeId(url) {
  if (!url) return null;
  try {
    const shortMatch = url.match(/youtu\.be\/([^?&\n#]+)/);
    if (shortMatch) return shortMatch[1];
    const watchMatch = url.match(/[?&]v=([^?&\n#]+)/);
    if (watchMatch) return watchMatch[1];
    const embedMatch = url.match(/embed\/([^?&\n#]+)/);
    if (embedMatch) return embedMatch[1];
  } catch {}
  return null;
}

const inputStyle    = { padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, width: "100%", boxSizing: "border-box" };
const videoRowStyle = { display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f3f4f6" };
const thumbStyle    = (vid) => ({ width: 72, height: 42, borderRadius: 6, background: vid ? "#000" : "#f3f4f6", flexShrink: 0, overflow: "hidden", position: "relative", cursor: vid ? "pointer" : "default" });
const playOverlay   = { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 14 };

function VideoManager({ course, onClose, onRefetch }) {
  const [videoForm,   setVideoForm]   = useState(emptyVideo);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(null);
  const [error,       setError]       = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!getYouTubeId(videoForm.url)) { setError("Please enter a valid YouTube URL"); return; }
    setSaving(true); setError("");
    try {
      await API.post(`/admin/demo-courses/${course._id}/videos`, {
        title: videoForm.title, url: videoForm.url,
        order: (course.videos?.length || 0) + 1,
      });
      setVideoForm(emptyVideo); onRefetch();
    } catch (err) { setError(err?.response?.data?.message || "Failed to add video"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;
    setDeleting(videoId);
    try {
      await API.delete(`/admin/demo-courses/${course._id}/videos/${videoId}`);
      onRefetch();
    } catch (err) { alert(err?.response?.data?.message || "Delete failed"); }
    finally { setDeleting(null); }
  };

  const previewId = getYouTubeId(videoForm.url);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "min(96vw,700px)", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Manage Videos</h2>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>{course.title}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>✕</button>
        </div>
        <div style={{ padding: "20px 22px" }}>
          <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#374151" }}>+ Add New Video</h3>
            {error && <p style={{ color: "#ef4444", fontSize: 12, margin: "0 0 8px" }}>{error}</p>}
            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input placeholder="Video Title (e.g. Module 1: Introduction)" value={videoForm.title}
                onChange={e => setVideoForm(p => ({ ...p, title: e.target.value }))} required style={inputStyle} />
              <input placeholder="YouTube URL (e.g. https://youtu.be/abc123)" value={videoForm.url}
                onChange={e => setVideoForm(p => ({ ...p, url: e.target.value }))} required
                style={{ ...inputStyle, borderColor: videoForm.url ? (previewId ? "#6366f1" : "#ef4444") : "#e5e7eb" }} />
              {videoForm.url && !previewId && <p style={{ color: "#ef4444", fontSize: 12, margin: 0 }}>Enter a valid YouTube URL</p>}
              {previewId && (
                <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "16/9", maxWidth: 320, border: "2px solid #6366f1" }}>
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${previewId}`} title="Preview" frameBorder="0" allowFullScreen style={{ display: "block" }} />
                </div>
              )}
              <button type="submit" disabled={saving || (videoForm.url && !previewId)}
                style={{ padding: "9px 20px", background: saving ? "#a5b4fc" : "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13, alignSelf: "flex-start" }}>
                {saving ? "Adding…" : "Add Video"}
              </button>
            </form>
          </div>

          <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#374151" }}>
            All Videos ({(course.videos?.length || 0) + (course.youtubeLink ? 1 : 0)})
          </h3>

          {course.youtubeLink && (
            <div style={{ ...videoRowStyle, background: "#f0f9ff", borderRadius: 8, padding: "10px", marginBottom: 4 }}>
              <div style={thumbStyle(getYouTubeId(course.youtubeLink))} onClick={() => setActiveVideo(getYouTubeId(course.youtubeLink))}>
                {getYouTubeId(course.youtubeLink) && <img src={`https://img.youtube.com/vi/${getYouTubeId(course.youtubeLink)}/default.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                <div style={playOverlay}>▶</div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 2px", color: "#0369a1" }}>🎬 Intro / Promo Video</p>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.youtubeLink}</p>
                <p style={{ fontSize: 10, color: "#0369a1", margin: "2px 0 0" }}>Set during creation — edit via Edit button</p>
              </div>
            </div>
          )}

          {!course.youtubeLink && (!course.videos || course.videos.length === 0) && (
            <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No videos yet. Add your first video above.</p>
          )}

          {[...(course.videos || [])].sort((a, b) => a.order - b.order).map((video, idx) => {
            const vid = getYouTubeId(video.url);
            return (
              <div key={video._id} style={videoRowStyle}>
                <div style={thumbStyle(vid)} onClick={() => vid && setActiveVideo(vid)}>
                  {vid && <img src={`https://img.youtube.com/vi/${vid}/default.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  {vid && <div style={playOverlay}>▶</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{idx + 1}. {video.title}</p>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{video.url}</p>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {vid && <button onClick={() => setActiveVideo(vid)} style={{ padding: "4px 10px", border: "none", background: "#6366f1", color: "#fff", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>▶ Play</button>}
                  <button onClick={() => handleDelete(video._id)} disabled={deleting === video._id}
                    style={{ padding: "4px 10px", border: "1px solid #ef4444", color: "#ef4444", background: "#fff", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                    {deleting === video._id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {activeVideo && (
        <div onClick={() => setActiveVideo(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "min(90vw,900px)", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", position: "relative" }}>
            <button onClick={() => setActiveVideo(null)} style={{ position: "absolute", top: 10, right: 14, color: "#fff", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 34, height: 34, fontSize: 18, cursor: "pointer", zIndex: 10 }}>✕</button>
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`} title="Video" frameBorder="0" allowFullScreen allow="autoplay" style={{ display: "block" }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function DemoCoursesPage() {
  const { data: courses, loading, error, refetch } = useFetch(getAllDemoCourses);
  const [form,          setForm]          = useState(empty);
  const [editing,       setEditing]       = useState(null);
  const [showForm,      setShowForm]      = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [formError,     setFormError]     = useState("");
  const [activeVideo,   setActiveVideo]   = useState(null);
  const [videoMgrCourse, setVideoMgrCourse] = useState(null);

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
    setForm({ title: c.title, description: c.description || "", youtubeLink: c.youtubeLink || "" });
    setEditing(c._id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this demo course?")) return;
    try { await deleteDemoCourse(id); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const previewId = getYouTubeId(form.youtubeLink);

  return (
    <div>
      {activeVideo && (
        <div onClick={() => setActiveVideo(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "min(90vw,900px)", aspectRatio: "16/9", borderRadius: 14, overflow: "hidden", position: "relative", boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
            <button onClick={() => setActiveVideo(null)} style={{ position: "absolute", top: 10, right: 14, color: "#fff", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 34, height: 34, fontSize: 18, cursor: "pointer", zIndex: 10, lineHeight: "34px" }}>✕</button>
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`} title="Demo Video" frameBorder="0" allowFullScreen allow="autoplay" style={{ display: "block" }} />
          </div>
        </div>
      )}

      {videoMgrCourse && (
        <VideoManager
          course={courses?.find(c => c._id === videoMgrCourse._id) || videoMgrCourse}
          onClose={() => setVideoMgrCourse(null)}
          onRefetch={refetch}
        />
      )}

      <div className="admin-page-header">
        <div><h1>Demo Courses</h1><p>Free preview courses visible to all students</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty); }}
          style={{ padding: "8px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
          {showForm ? "Cancel" : "+ Add Demo Course"}
        </button>
      </div>

      {showForm && (
        <section className="admin-section" style={{ marginBottom: 28 }}>
          <h2>{editing ? "Edit Demo Course" : "New Demo Course"}</h2>
          {formError && <p style={{ color: "#ef4444", marginBottom: 10, fontSize: 13 }}>{formError}</p>}
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <input name="title" placeholder="Course Title" value={form.title} onChange={handleChange} required
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            <textarea name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} rows={2}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, resize: "vertical" }} />
            <div>
              <input name="youtubeLink" placeholder="Intro / Promo YouTube Link (optional)" value={form.youtubeLink} onChange={handleChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${previewId ? "#6366f1" : form.youtubeLink ? "#ef4444" : "#e5e7eb"}`, fontSize: 14, boxSizing: "border-box" }} />
              {form.youtubeLink && !previewId && <p style={{ color: "#ef4444", fontSize: 12, margin: "4px 0 0" }}>⚠ Paste a valid YouTube URL</p>}
            </div>
            {previewId && (
              <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/9", maxWidth: 440, border: "2px solid #6366f1" }}>
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${previewId}`} title="Preview" frameBorder="0" allowFullScreen style={{ display: "block" }} />
              </div>
            )}
            <button type="submit" disabled={saving || (form.youtubeLink && !previewId)}
              style={{ padding: "10px 24px", background: saving ? "#a5b4fc" : "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer", width: "fit-content", fontWeight: 600 }}>
              {saving ? "Saving..." : editing ? "Update Demo Course" : "Create Demo Course"}
            </button>
          </form>
        </section>
      )}

      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
          {[1, 2, 3].map(i => <div key={i} style={{ background: "#f3f4f6", borderRadius: 12, height: 260 }} />)}
        </div>
      )}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20, marginTop: 8 }}>
        {courses?.map(course => {
          const firstVid   = course.videos?.length > 0 ? getYouTubeId(course.videos[0].url) : getYouTubeId(course.youtubeLink);
          const videoCount = (course.videos?.length || 0) + (course.youtubeLink ? 1 : 0);
          return (
            <div key={course._id}
              style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.15)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"}>
              <div style={{ position: "relative", aspectRatio: "16/9", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", cursor: firstVid ? "pointer" : "default", overflow: "hidden" }}
                onClick={() => firstVid && setActiveVideo(firstVid)}>
                {firstVid ? (
                  <>
                    <img src={`https://img.youtube.com/vi/${firstVid}/hqdefault.jpg`} alt={course.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={e => { e.target.style.display = "none"; }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.15)" }}>
                      <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.92)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>▶</div>
                    </div>
                    {videoCount > 0 && (
                      <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.7)", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                        {videoCount} {videoCount === 1 ? "video" : "videos"}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 8 }}>
                    <span style={{ fontSize: 40, opacity: 0.5 }}>▶</span>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>No video</span>
                  </div>
                )}
              </div>
              <div style={{ padding: "16px 18px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#111827" }}>{course.title}</h3>
                {course.description && (
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: "#6b7280", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {course.description}
                  </p>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {firstVid && (
                    <button onClick={() => setActiveVideo(firstVid)}
                      style={{ padding: "5px 14px", borderRadius: 7, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>▶ Watch</button>
                  )}
                  <button onClick={() => setVideoMgrCourse(course)}
                    style={{ padding: "5px 14px", borderRadius: 7, background: videoCount > 0 ? "#f0fdf4" : "#fefce8", color: videoCount > 0 ? "#16a34a" : "#854d0e", border: `1px solid ${videoCount > 0 ? "#86efac" : "#fcd34d"}`, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                    🎬 Videos ({videoCount})
                  </button>
                  <button onClick={() => handleEdit(course)}
                    style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid #6366f1", color: "#6366f1", background: "#fff", cursor: "pointer", fontSize: 12 }}>Edit</button>
                  <button onClick={() => handleDelete(course._id)}
                    style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid #ef4444", color: "#ef4444", background: "#fff", cursor: "pointer", fontSize: 12 }}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && !courses?.length && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>▶</div>
          <p>No demo courses yet. Click <strong>+ Add Demo Course</strong> to create your first one!</p>
        </div>
      )}
    </div>
  );
}