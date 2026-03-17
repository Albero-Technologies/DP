import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getAllLeads, createLead, updateLead, deleteLead } from "../../api/leads.api";

const STATUS_COLORS = {
  NEW: "#dbeafe", CONTACTED: "#fef9c3", INTERESTED: "#dcfce7",
  CONVERTED: "#bbf7d0", LOST: "#fee2e2"
};
const STATUS_TEXT = {
  NEW: "#1d4ed8", CONTACTED: "#92400e", INTERESTED: "#15803d",
  CONVERTED: "#166534", LOST: "#dc2626"
};
const empty = { name:"", email:"", phone:"", course:"", status:"NEW", notes:"" };

export default function LeadsPage() {
  const { data: leads, loading, error, refetch } = useFetch(getAllLeads);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await updateLead(editing, form);
      else await createLead(form);
      setForm(empty); setEditing(null); setShowForm(false); refetch();
    } catch (err) { alert(err.response?.data?.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleEdit = (l) => {
    setForm({ name:l.name, email:l.email||"", phone:l.phone||"", course:l.course||"", status:l.status, notes:l.notes||"" });
    setEditing(l._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try { await deleteLead(id); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Leads</h1><p>Track and manage potential students</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty); }}
          style={{cursor:"pointer",padding:"8px 16px",background:"#6366f1",color:"#fff",border:"none",borderRadius:8}}>
          {showForm ? "Cancel" : "+ Add Lead"}
        </button>
      </div>

      {showForm && (
        <section className="admin-section" style={{marginBottom:24}}>
          <h2>{editing ? "Edit Lead" : "New Lead"}</h2>
          <form onSubmit={handleSubmit} style={{display:"grid",gap:12}}>
            {[
              {name:"name",placeholder:"Full Name",required:true},
              {name:"email",placeholder:"Email",type:"email"},
              {name:"phone",placeholder:"Phone"},
              {name:"course",placeholder:"Interested Course"},
            ].map(f => (
              <input key={f.name} {...f} value={form[f.name]} onChange={handleChange}
                style={{padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:14}} />
            ))}
            <select name="status" value={form.status} onChange={handleChange}
              style={{padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:14}}>
              {["NEW","CONTACTED","INTERESTED","CONVERTED","LOST"].map(s => <option key={s}>{s}</option>)}
            </select>
            <textarea name="notes" placeholder="Notes..." value={form.notes} onChange={handleChange} rows={3}
              style={{padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:14,resize:"vertical"}} />
            <button type="submit" disabled={saving}
              style={{padding:"10px 20px",background:"#6366f1",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",width:"fit-content"}}>
              {saving ? "Saving..." : editing ? "Update" : "Add Lead"}
            </button>
          </form>
        </section>
      )}

      {loading && <p style={{color:"#6b7280"}}>Loading leads...</p>}
      {error && <p style={{color:"#ef4444"}}>{error}</p>}

      <div className="admin-list">
        {leads?.map(l => (
          <div className="admin-list-item" key={l._id}>
            <div>
              <strong>{l.name}</strong>
              <div style={{color:"#6b7280",fontSize:12}}>{l.email} · {l.phone} · {l.course}</div>
              {l.notes && <div style={{color:"#9ca3af",fontSize:11,marginTop:2}}>{l.notes}</div>}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{padding:"3px 10px",borderRadius:99,fontSize:11,fontWeight:600,background:STATUS_COLORS[l.status],color:STATUS_TEXT[l.status]}}>
                {l.status}
              </span>
              <button onClick={() => handleEdit(l)}
                style={{padding:"4px 12px",borderRadius:6,border:"1px solid #6366f1",color:"#6366f1",background:"transparent",cursor:"pointer",fontSize:12}}>Edit</button>
              <button onClick={() => handleDelete(l._id)}
                style={{padding:"4px 12px",borderRadius:6,border:"1px solid #ef4444",color:"#ef4444",background:"transparent",cursor:"pointer",fontSize:12}}>Delete</button>
            </div>
          </div>
        ))}
        {!loading && !leads?.length && <p style={{color:"#6b7280",padding:16}}>No leads yet. Add your first lead!</p>}
      </div>
    </div>
  );
}
