import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getAllDemoCourses } from "../../api/demo-courses.api";

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/);
  return m ? m[1] : null;
}

export default function DemoCoursesSection() {
  const { data: courses, loading } = useFetch(getAllDemoCourses);
  const [activeVideo, setActiveVideo] = useState(null);


  if (loading) return null;
  if (!courses?.length) return null;



  return (
    <>
      {activeVideo && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setActiveVideo(null)}>
          <div style={{ width: "min(90vw,860px)", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)} style={{ position: "absolute", top: 16, right: 20, color: "#fff", background: "transparent", border: "none", fontSize: 28, cursor: "pointer", zIndex: 10 }}>✕</button>
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`} title="Demo" frameBorder="0" allowFullScreen allow="autoplay" />
          </div>
        </div>
      )}
      <section className="admin-section" style={{ marginBottom: 24 }}>
        <h2>🎓 Free Demo Classes</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16, marginTop: 12 }}>
          {courses.map(c => {
            const vid = getYouTubeId(c.youtubeLink);
            return (
              <div key={c._id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                onClick={() => vid && setActiveVideo(vid)}>
                {vid ? (
                  <div style={{ position: "relative", aspectRatio: "16/9", background: "#000" }}>
                    <img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>▶</div>
                    </div>
                  </div>
                ) : <div style={{ height: 120, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>📹</div>}
                <div style={{ padding: "12px 14px" }}>
                  <strong style={{ fontSize: 14 }}>{c.title}</strong>
                  {c.description && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>{c.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );



}

