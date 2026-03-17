import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getStudentCourses } from "../../api/students.api";

function getYouTubeEmbedId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|playlist\?list=)|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

export default function MyCoursesPage() {
  const { data: enrollments, loading, error } = useFetch(getStudentCourses);
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>My Courses</h1><p>Your enrolled programs</p></div>
        <span className="admin-pill">{enrollments?.length ?? 0} enrolled</span>
      </div>

      {loading && <p style={{color:"#6b7280"}}>Loading courses...</p>}
      {error && <p style={{color:"#ef4444"}}>{error}</p>}

      {/* Video Player Modal */}
      {activeVideo && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}
          onClick={() => setActiveVideo(null)}>
          <div style={{background:"#000",borderRadius:12,overflow:"hidden",width:"min(90vw,900px)",aspectRatio:"16/9",position:"relative"}}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)}
              style={{position:"absolute",top:8,right:12,background:"transparent",border:"none",color:"#fff",fontSize:24,cursor:"pointer",zIndex:10}}>✕</button>
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${activeVideo}`}
              title="Course Video" frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen style={{display:"block"}}
            />
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20,marginTop:8}}>
        {enrollments?.map(enr => {
          const course = enr.batch?.course;
          const trainer = enr.batch?.trainer;
          const videoId = getYouTubeEmbedId(course?.youtubeLink);
          return (
            <div key={enr._id} style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              {/* Thumbnail */}
              <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",height:140,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor: videoId ? "pointer":"default"}}
                onClick={() => videoId && setActiveVideo(videoId)}>
                {videoId
                  ? <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="thumbnail" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.85}} />
                  : <span style={{color:"#fff",fontSize:40,opacity:0.4}}>📚</span>
                }
                {videoId && (
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:52,height:52,background:"rgba(255,255,255,0.9)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>▶</div>
                  </div>
                )}
              </div>
              <div style={{padding:"16px"}}>
                <h3 style={{margin:"0 0 6px",fontSize:16,fontWeight:700,color:"#111827"}}>{course?.title || "Course"}</h3>
                <div style={{color:"#6b7280",fontSize:13,marginBottom:4}}>
                  Trainer: <strong>{trainer?.name || "TBA"}</strong>
                </div>
                <div style={{color:"#6b7280",fontSize:13,marginBottom:4}}>
                  Batch: <strong>{enr.batch?.name || "—"}</strong>
                </div>
                <div style={{color:"#6b7280",fontSize:13,marginBottom:12}}>
                  Duration: {course?.durationInMonths} months
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{padding:"3px 10px",borderRadius:99,fontSize:11,fontWeight:600,
                    background: enr.status==="ACTIVE"?"#dcfce7":enr.status==="COMPLETED"?"#dbeafe":"#fee2e2",
                    color: enr.status==="ACTIVE"?"#166534":enr.status==="COMPLETED"?"#1d4ed8":"#dc2626"}}>
                    {enr.status}
                  </span>
                  {videoId && (
                    <button onClick={() => setActiveVideo(videoId)}
                      style={{padding:"4px 14px",borderRadius:6,background:"#6366f1",color:"#fff",border:"none",cursor:"pointer",fontSize:12}}>
                      ▶ Watch
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!loading && !enrollments?.length && (
        <div style={{textAlign:"center",padding:"60px 20px",color:"#6b7280"}}>
          <div style={{fontSize:48,marginBottom:12}}>📚</div>
          <p>You are not enrolled in any course yet.</p>
          <p style={{fontSize:13}}>Please contact your counselor to get enrolled.</p>
        </div>
      )}
    </div>
  );
}
