import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { createTicket, getMyTickets } from "../../api/support.api";

const STATUS_COLORS = {
  OPEN: { bg:"#dbeafe", text:"#1d4ed8" },
  IN_PROGRESS: { bg:"#fef9c3", text:"#92400e" },
  RESOLVED: { bg:"#dcfce7", text:"#166534" },
  CLOSED: { bg:"#f3f4f6", text:"#6b7280" },
};

export default function SupportPage() {
  const { data: tickets, loading, error, refetch } = useFetch(getMyTickets);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setFormError("");
    try {
      await createTicket(form);
      setForm({ subject:"", message:"" });
      setShowForm(false);
      refetch();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit ticket");
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Support</h1><p>Get help from our team</p></div>
        <button onClick={() => setShowForm(!showForm)}
          style={{cursor:"pointer",padding:"8px 16px",background:"#6366f1",color:"#fff",border:"none",borderRadius:8}}>
          {showForm ? "Cancel" : "+ New Ticket"}
        </button>
      </div>

      {showForm && (
        <section className="admin-section" style={{marginBottom:24}}>
          <h2>Submit Support Ticket</h2>
          {formError && <p style={{color:"#ef4444"}}>{formError}</p>}
          <form onSubmit={handleSubmit} style={{display:"grid",gap:12}}>
            <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required
              style={{padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:14}} />
            <textarea name="message" placeholder="Describe your issue..." value={form.message} onChange={handleChange} required rows={4}
              style={{padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:14,resize:"vertical"}} />
            <button type="submit" disabled={saving}
              style={{padding:"10px 20px",background:"#6366f1",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",width:"fit-content"}}>
              {saving ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </section>
      )}

      {loading && <p style={{color:"#6b7280"}}>Loading tickets...</p>}
      {error && <p style={{color:"#ef4444"}}>{error}</p>}

      <div className="admin-list">
        {tickets?.map(t => {
          const sc = STATUS_COLORS[t.status] || STATUS_COLORS.OPEN;
          return (
            <div key={t._id} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"16px 20px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <strong style={{fontSize:15}}>{t.subject}</strong>
                <span style={{padding:"3px 10px",borderRadius:99,fontSize:11,fontWeight:600,background:sc.bg,color:sc.text}}>{t.status}</span>
              </div>
              <p style={{color:"#6b7280",fontSize:13,margin:"0 0 8px"}}>{t.message}</p>
              {t.reply && (
                <div style={{background:"#f0fdf4",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid #16a34a",marginTop:8}}>
                  <div style={{fontSize:12,color:"#16a34a",fontWeight:600,marginBottom:4}}>Support Reply:</div>
                  <p style={{margin:0,fontSize:13,color:"#374151"}}>{t.reply}</p>
                </div>
              )}
              <div style={{color:"#9ca3af",fontSize:11,marginTop:8}}>{new Date(t.createdAt).toLocaleDateString()}</div>
            </div>
          );
        })}
        {!loading && !tickets?.length && (
          <div style={{textAlign:"center",padding:"60px 20px",color:"#6b7280"}}>
            <div style={{fontSize:48,marginBottom:12}}>🎧</div>
            <p>No support tickets yet. We're here to help!</p>
          </div>
        )}
      </div>
    </div>
  );
}
