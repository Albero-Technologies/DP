import { useState, useEffect } from "react";
import API from "../../api/axiosInstance";
import useAuth from "../../context/useAuth";

function getYouTubeId(url) {
  if (!url) return null;
  const s = url.match(/youtu\.be\/([^?&\n#]+)/);
  if (s) return s[1];
  const w = url.match(/[?&]v=([^?&\n#]+)/);
  if (w) return w[1];
  const e = url.match(/embed\/([^?&\n#]+)/);
  return e ? e[1] : null;
}

function VideoModal({ videoId, onClose }) {
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"min(92vw,900px)",aspectRatio:"16/9",borderRadius:14,overflow:"hidden",position:"relative",boxShadow:"0 8px 40px rgba(0,0,0,0.6)" }}>
        <button onClick={onClose} style={{ position:"absolute",top:10,right:14,color:"#fff",background:"rgba(0,0,0,0.55)",border:"none",borderRadius:"50%",width:34,height:34,fontSize:18,cursor:"pointer",zIndex:10,lineHeight:"34px" }}>✕</button>
        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} title="Video" frameBorder="0" allowFullScreen allow="autoplay" style={{ display:"block" }} />
      </div>
    </div>
  );
}

function CourseVideosModal({ course, isLocked, onClose }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const allVideos = [];
  if (course.youtubeLink) allVideos.push({ _id:"intro", title:"Intro / Promo Video", url:course.youtubeLink, isIntro:true });
  if (course.videos?.length) [...course.videos].sort((a,b)=>a.order-b.order).forEach(v=>allVideos.push(v));

  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff",borderRadius:16,width:"min(96vw,680px)",maxHeight:"88vh",overflowY:"auto",boxShadow:"0 8px 40px rgba(0,0,0,0.25)" }}>
        {activeVideo && !isLocked && <VideoModal videoId={activeVideo} onClose={()=>setActiveVideo(null)} />}

        <div style={{ padding:"18px 22px",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <h2 style={{ margin:0,fontSize:17,fontWeight:700 }}>{course.title}</h2>
            <p style={{ margin:"3px 0 0",fontSize:12,color:"#6b7280" }}>
              {allVideos.length} video{allVideos.length!==1?"s":""}
              {isLocked
                ? <span style={{ marginLeft:8,color:"#f59e0b",fontWeight:700 }}>🔒 Locked</span>
                : <span style={{ marginLeft:8,color:"#16a34a",fontWeight:700 }}>✅ Unlocked</span>}
            </p>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#6b7280" }}>✕</button>
        </div>

        <div style={{ padding:"20px 22px" }}>
          {isLocked && (
            <div style={{ background:"#fef9c3",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:13,color:"#92400e",fontWeight:600 }}>
              🔒 Complete your initial payment to unlock these videos.
            </div>
          )}
          {allVideos.length===0 && <p style={{ color:"#9ca3af",textAlign:"center",padding:"20px 0" }}>No videos yet.</p>}
          {allVideos.map((video,idx) => {
            const vid = getYouTubeId(video.url);
            return (
              <div key={video._id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:idx<allVideos.length-1?"1px solid #f3f4f6":"none" }}>
                <div onClick={()=>!isLocked&&vid&&setActiveVideo(vid)}
                  style={{ width:80,height:48,borderRadius:6,background:video.isIntro?"#dbeafe":"#f3f4f6",flexShrink:0,overflow:"hidden",position:"relative",cursor:isLocked?"not-allowed":vid?"pointer":"default" }}>
                  {vid && <img src={`https://img.youtube.com/vi/${vid}/default.jpg`} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",filter:isLocked?"brightness(0.3) grayscale(1)":"none" }} />}
                  {!isLocked&&vid && <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.25)" }}><span style={{ color:"#fff",fontSize:16 }}>▶</span></div>}
                  {isLocked && <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}><span style={{ fontSize:18 }}>🔒</span></div>}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <p style={{ margin:0,fontWeight:600,fontSize:13,color:video.isIntro?"#0369a1":isLocked?"#9ca3af":"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                    {video.isIntro?"🎬 ":`${idx}. `}{video.title}
                  </p>
                </div>
                {isLocked
                  ? <span style={{ fontSize:20,flexShrink:0 }}>🔒</span>
                  : vid ? <button onClick={()=>setActiveVideo(vid)} style={{ padding:"5px 14px",background:"#6366f1",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600,flexShrink:0 }}>▶ Play</button>
                  : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function StudentDemoCoursesPage() {
  const { user } = useAuth();
  const [courses,      setCourses]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeVideo,  setActiveVideo]  = useState(null);
  const [openCourse,   setOpenCourse]   = useState(null);
  const [accessStatus, setAccessStatus] = useState(user?.accessStatus || "INACTIVE");

  useEffect(() => {
    API.get("/auth/me").then(r=>setAccessStatus((r.data.user||r.data)?.accessStatus||"INACTIVE")).catch(()=>{});
    API.get("/demo-courses").then(r=>setCourses(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const isLocked = accessStatus === "INACTIVE";

  return (
    <div>
      {activeVideo && !isLocked && <VideoModal videoId={activeVideo} onClose={()=>setActiveVideo(null)} />}
      {openCourse && <CourseVideosModal course={openCourse} isLocked={isLocked} onClose={()=>setOpenCourse(null)} />}

      <div className="admin-page-header">
        <div><h1>Demo Courses</h1><p>Free preview courses</p></div>
        <span style={{ padding:"5px 14px",borderRadius:99,fontSize:12,fontWeight:700,background:isLocked?"#fee2e2":"#dcfce7",color:isLocked?"#dc2626":"#16a34a" }}>
          {isLocked?"🔒 Locked":"✅ Unlocked"}
        </span>
      </div>

      {isLocked && (
        <div style={{ background:"#fef9c3",border:"1px solid #fde68a",borderRadius:12,padding:"14px 18px",marginBottom:24,fontSize:14,color:"#92400e",fontWeight:600 }}>
          🔒 Enroll and complete your initial payment to unlock demo videos.
        </div>
      )}

      {loading && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20 }}>
          {[1,2,3].map(i=><div key={i} style={{ background:"#f3f4f6",borderRadius:14,height:260 }} />)}
        </div>
      )}

      {!loading && courses.length===0 && (
        <div style={{ textAlign:"center",padding:"60px 20px",color:"#9ca3af" }}>
          <div style={{ fontSize:48,marginBottom:12 }}>🎬</div>
          <p>No demo courses available yet.</p>
        </div>
      )}

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20 }}>
        {courses.map(course => {
          const allVids = [...(course.youtubeLink?[{url:course.youtubeLink}]:[]),...(course.videos||[])];
          const firstVid = getYouTubeId(allVids[0]?.url);
          const videoCount = allVids.length;

          return (
            <div key={course._id}
              style={{ background:"#fff",borderRadius:14,border:"1px solid #e5e7eb",overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.07)",transition:"box-shadow 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(99,102,241,0.15)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.07)"}>

              {/* Thumbnail */}
              <div onClick={()=>!isLocked&&firstVid&&setActiveVideo(firstVid)}
                style={{ position:"relative",aspectRatio:"16/9",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",cursor:isLocked?"not-allowed":firstVid?"pointer":"default",overflow:"hidden" }}>
                {firstVid && <img src={`https://img.youtube.com/vi/${firstVid}/hqdefault.jpg`} alt={course.title} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",filter:isLocked?"brightness(0.3) grayscale(0.5)":"none" }} onError={e=>{e.target.style.display="none"}} />}
                {!isLocked && firstVid && (
                  <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.15)" }}>
                    <div style={{ width:52,height:52,background:"rgba(255,255,255,0.92)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 2px 12px rgba(0,0,0,0.3)" }}>▶</div>
                  </div>
                )}
                {isLocked && (
                  <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6 }}>
                    <span style={{ fontSize:36 }}>🔒</span>
                    <p style={{ color:"#fff",fontSize:12,fontWeight:700,margin:0 }}>Locked</p>
                  </div>
                )}
                {videoCount>0 && (
                  <div style={{ position:"absolute",top:8,left:8,background:"rgba(0,0,0,0.7)",color:"#fff",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700 }}>
                    {videoCount} {videoCount===1?"video":"videos"}
                  </div>
                )}
              </div>

              {/* Card content */}
              <div style={{ padding:"16px 18px" }}>
                <h3 style={{ margin:"0 0 4px",fontSize:15,fontWeight:700,color:"#111827" }}>{course.title}</h3>
                {course.description && (
                  <p style={{ margin:"0 0 14px",fontSize:12,color:"#6b7280",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>
                    {course.description}
                  </p>
                )}
                <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                  {!isLocked && firstVid && (
                    <button onClick={()=>setActiveVideo(firstVid)}
                      style={{ padding:"6px 14px",borderRadius:7,background:"#6366f1",color:"#fff",border:"none",cursor:"pointer",fontSize:12,fontWeight:600 }}>
                      ▶ Watch
                    </button>
                  )}
                  <button onClick={()=>setOpenCourse(course)}
                    style={{ padding:"6px 14px",borderRadius:7,background:isLocked?"#fff7ed":"#f0fdf4",color:isLocked?"#c2410c":"#16a34a",border:`1px solid ${isLocked?"#fed7aa":"#86efac"}`,cursor:"pointer",fontSize:12,fontWeight:600 }}>
                    {isLocked?"🔒":"🎬"} Videos ({videoCount})
                  </button>
                </div>
                {isLocked && <div style={{ marginTop:10,fontSize:11,color:"#f59e0b",fontWeight:700 }}>Complete initial payment to unlock</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}