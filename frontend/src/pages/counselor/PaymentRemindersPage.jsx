import { useState, useEffect } from "react";
import API from "../../api/axiosInstance";

export default function PaymentRemindersPage() {
  const [reminders,   setReminders]   = useState([]);
  const [students,    setStudents]     = useState([]);
  const [enrollments, setEnrollments]  = useState([]);
  const [form, setForm] = useState({
    studentDbId: "", courseType: "BATCH", enrollmentId: "", amount: "", message: "",
  });
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  const fetchReminders = () =>
    API.get("/counselor/reminders").then(r => setReminders(r.data.data || [])).catch(() => {});

  useEffect(() => {
    fetchReminders();
    API.get("/counselor/students").then(r => setStudents(r.data.data || [])).catch(() => {});
  }, []);

  const handleStudentChange = async (studentDbId) => {
    setForm(f => ({ ...f, studentDbId, enrollmentId: "", amount: "" }));
    if (!studentDbId) { setEnrollments([]); return; }
    try {
      const res = await API.get(`/enrollments?studentId=${studentDbId}`);
      setEnrollments(res.data.data || []);
    } catch { setEnrollments([]); }
  };

  const handleEnrollmentChange = (enrollmentId) => {
    const enr = enrollments.find(e => e._id === enrollmentId);
    const fees = enr?.batch?.course?.fees || "";
    setForm(f => ({ ...f, enrollmentId, amount: fees ? String(fees) : "" }));
  };

  const handleSend = async (e) => {
    e.preventDefault(); setError(""); setSuccess(""); setSending(true);
    const student = students.find(s => s._id === form.studentDbId);
    if (!student?.studentId) { setError("Select a student"); setSending(false); return; }
    try {
      await API.post("/counselor/reminders", {
        studentId:    student.studentId,
        courseType:   form.courseType,
        enrollmentId: form.courseType === "BATCH" ? form.enrollmentId : null,
        amount:       Number(form.amount),
        message:      form.message,
      });
      setSuccess(`Reminder sent to ${student.name}!`);
      setForm({ studentDbId:"", courseType:"BATCH", enrollmentId:"", amount:"", message:"" });
      setEnrollments([]);
      fetchReminders();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send reminder");
    } finally { setSending(false); }
  };

  const markPaid = async (id) => {
    try { await API.patch(`/counselor/reminders/${id}`, { status:"PAID" }); fetchReminders(); }
    catch { alert("Failed"); }
  };

  const selectedStudent = students.find(s => s._id === form.studentDbId);
  const canShowStep3 = form.studentDbId && form.courseType === "BATCH";
  const canShowStep4 = form.studentDbId && (form.courseType === "DEMO" || form.enrollmentId);

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Payment Reminders</h1>
      <p style={s.sub}>Send reminders with course type — invoice auto-generates for student.</p>

      <div style={s.formCard}>
        <h2 style={s.h2}>📤 Send New Reminder</h2>
        {error   && <div style={s.error}>{error}</div>}
        {success && <div style={s.successMsg}>{success}</div>}

        <form onSubmit={handleSend} style={s.form}>

          {/* Step 1 — Student */}
          <div style={s.field}>
            <label style={s.label}>Step 1 — Select Student *</label>
            <select style={s.input} value={form.studentDbId}
              onChange={e => handleStudentChange(e.target.value)} required>
              <option value="">Choose student…</option>
              {students.map(st => (
                <option key={st._id} value={st._id}>
                  {st.name} — {st.studentId} ({st.email})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2 — Course Type */}
          {form.studentDbId && (
            <div style={s.field}>
              <label style={s.label}>Step 2 — Payment Type *</label>
              <div style={{ display:"flex", gap:10 }}>
                {[
                  { val:"BATCH", icon:"📚", label:"Main Course (Batch)", desc:"Unlock enrolled batch content" },
                  { val:"DEMO",  icon:"▶️",  label:"Demo Course Access",  desc:"Unlock demo preview videos" },
                ].map(opt => (
                  <div key={opt.val}
                    onClick={() => setForm(f => ({ ...f, courseType:opt.val, enrollmentId:"", amount:"" }))}
                    style={{ flex:1, padding:"12px 14px", borderRadius:10,
                      border:`2px solid ${form.courseType===opt.val?"#6366f1":"#e5e7eb"}`,
                      background:form.courseType===opt.val?"#eff6ff":"#fff",
                      cursor:"pointer", transition:"all 0.15s" }}>
                    <div style={{ fontSize:22, marginBottom:4 }}>{opt.icon}</div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{opt.label}</div>
                    <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Batch select (BATCH only) */}
          {canShowStep3 && (
            <div style={s.field}>
              <label style={s.label}>Step 3 — Select Batch *</label>
              {enrollments.length === 0 ? (
                <div style={{ padding:"10px 14px", background:"#fef9c3", borderRadius:8, fontSize:13, color:"#92400e" }}>
                  ⚠ No batch enrollments found. Assign a batch first from Students page.
                </div>
              ) : (
                <select style={s.input} value={form.enrollmentId}
                  onChange={e => handleEnrollmentChange(e.target.value)} required>
                  <option value="">Choose batch…</option>
                  {enrollments.map(enr => (
                    <option key={enr._id} value={enr._id}>
                      {enr.batch?.name} — {enr.batch?.course?.title} (₹{enr.batch?.course?.fees?.toLocaleString("en-IN")})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Step 4 — Amount + Message */}
          {canShowStep4 && (
            <>
              <div style={s.field}>
                <label style={s.label}>Amount (₹) *</label>
                <input style={s.input} type="number" value={form.amount} min={1} required
                  onChange={e => setForm(f => ({ ...f, amount:e.target.value }))}
                  placeholder={form.courseType==="DEMO"?"Demo unlock fee":"Auto-filled from course fees"} />
              </div>

              <div style={s.field}>
                <label style={s.label}>Message *</label>
                <textarea style={{ ...s.input, height:80, resize:"vertical" }}
                  value={form.message} required
                  onChange={e => setForm(f => ({ ...f, message:e.target.value }))}
                  placeholder={form.courseType==="DEMO"
                    ? "Please pay to unlock demo course videos…"
                    : "Please complete your course fee payment…"} />
              </div>

              {/* Preview */}
              {selectedStudent && form.amount && (
                <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:10, padding:"12px 16px", fontSize:13 }}>
                  <strong>Preview:</strong> Reminder to <strong>{selectedStudent.name}</strong> ({selectedStudent.studentId})
                  {" "}for <strong>{form.courseType==="DEMO" ? "Demo Course Access" : enrollments.find(e=>e._id===form.enrollmentId)?.batch?.name || "Batch"}</strong>
                  {" "}— <strong>₹{Number(form.amount||0).toLocaleString("en-IN")}</strong>
                  <br/><span style={{ fontSize:11, color:"#6b7280" }}>Invoice will auto-generate when student pays.</span>
                </div>
              )}

              <button type="submit" disabled={sending} style={s.btn}>
                {sending ? "Sending…" : "📤 Send Reminder"}
              </button>
            </>
          )}
        </form>
      </div>

      {/* Sent Reminders */}
      <h2 style={{ ...s.h2, marginTop:"2rem" }}>Sent Reminders ({reminders.length})</h2>
      {reminders.length === 0 ? (
        <p style={{ color:"#94A3B8" }}>No reminders sent yet.</p>
      ) : (
        <div style={s.list}>
          {reminders.map(r => (
            <div key={r._id} style={s.card}>
              <div style={s.cardTop}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                    <p style={s.studentName}>{r.student?.name}</p>
                    <span style={{ fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:99,
                      background:r.courseType==="DEMO"?"#ede9fe":"#eff6ff",
                      color:r.courseType==="DEMO"?"#7c3aed":"#1d4ed8" }}>
                      {r.courseType==="DEMO" ? "▶ Demo" : "📚 Batch"}
                    </span>
                  </div>
                  <p style={s.studentMeta}>{r.student?.studentId} · {r.student?.email}</p>
                </div>
                <div style={s.right}>
                  <span style={{ ...s.badge, ...(r.status==="PAID"?s.paidBadge:s.pendingBadge) }}>
                    {r.status}
                  </span>
                  <p style={s.amount}>₹{r.amount?.toLocaleString("en-IN")}</p>
                </div>
              </div>
              <p style={s.message}>"{r.message}"</p>
              <div style={s.cardBottom}>
                <span style={s.date}>{new Date(r.createdAt).toLocaleDateString("en-IN",{dateStyle:"medium"})}</span>
                {r.status==="PENDING" && (
                  <button onClick={()=>markPaid(r._id)} style={s.markBtn}>✓ Mark as Paid</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page:        { padding:"1.5rem 2rem", maxWidth:860, margin:"0 auto", fontFamily:"'DM Sans', sans-serif" },
  h1:          { fontSize:"1.5rem", fontWeight:800, color:"#161619", marginBottom:4 },
  h2:          { fontSize:"1.05rem", fontWeight:700, color:"#262832", marginBottom:"1rem" },
  sub:         { color:"#64748B", fontSize:"0.9rem", marginBottom:"1.5rem" },
  formCard:    { background:"#F8FAFC", border:"1.5px solid #E2E8F0", borderRadius:14, padding:"1.5rem" },
  form:        { display:"flex", flexDirection:"column", gap:"0.9rem" },
  field:       { display:"flex", flexDirection:"column", gap:4, flex:1 },
  label:       { fontSize:"0.72rem", fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:0.5 },
  input:       { padding:"0.7rem 0.9rem", fontSize:"0.95rem", border:"1.5px solid #e5e7eb", borderRadius:8, color:"#161619", outline:"none", background:"#fff" },
  btn:         { padding:"0.75rem 1.5rem", background:"#6366f1", color:"#fff", border:"none", borderRadius:9, cursor:"pointer", fontWeight:700, fontSize:"0.95rem", alignSelf:"flex-start" },
  error:       { background:"#FEE2E2", color:"#991B1B", borderRadius:8, padding:"0.6rem 0.9rem", fontSize:"0.85rem" },
  successMsg:  { background:"#DCFCE7", color:"#166534", borderRadius:8, padding:"0.6rem 0.9rem", fontSize:"0.85rem" },
  list:        { display:"flex", flexDirection:"column", gap:"0.75rem" },
  card:        { background:"#fff", border:"1.5px solid #E2E8F0", borderRadius:12, padding:"1rem 1.25rem" },
  cardTop:     { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 },
  studentName: { fontWeight:700, fontSize:"0.95rem", color:"#161619", margin:0 },
  studentMeta: { fontSize:"0.78rem", color:"#94A3B8", margin:"2px 0 0" },
  right:       { textAlign:"right" },
  amount:      { fontWeight:700, color:"#6366f1", fontSize:"1rem", margin:"4px 0 0" },
  message:     { fontSize:"0.86rem", color:"#64748B", fontStyle:"italic", margin:"0 0 8px" },
  cardBottom:  { display:"flex", justifyContent:"space-between", alignItems:"center" },
  date:        { fontSize:"0.76rem", color:"#94A3B8" },
  badge:       { fontSize:"0.72rem", fontWeight:700, padding:"0.2rem 0.6rem", borderRadius:100 },
  paidBadge:   { background:"#DCFCE7", color:"#166534" },
  pendingBadge:{ background:"#FEF3C7", color:"#92400E" },
  markBtn:     { padding:"0.3rem 0.8rem", background:"transparent", border:"1px solid #6366f1", color:"#6366f1", borderRadius:6, cursor:"pointer", fontSize:"0.78rem", fontWeight:600 },
};