import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import {
  getAllCounselors, createCounselor, updateCounselor, deleteCounselor,
  getAllTrainers, createTrainer, updateTrainer, deleteTrainer,
} from "../../api/admin.api";

const emptyForm = { name: "", email: "", password: "", phone: "" };

function StaffSection({ title, color, fetchFn, createFn, updateFn, deleteFn }) {
  const { data: staff, loading, error, refetch } = useFetch(fetchFn);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setFormError("");
    try {
      if (editing) await updateFn(editing, form);
      else await createFn(form);
      setForm(emptyForm); setEditing(null); setShowForm(false); refetch();
    } catch (err) { setFormError(err.response?.data?.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleEdit = (s) => {
    setForm({ name: s.name, email: s.email, password: "", phone: s.phone || "" });
    setEditing(s._id); setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await deleteFn(id); refetch(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  return (
    <section className="admin-section" style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ color }}>{title} <span style={{ fontSize: 13, fontWeight: 400, color: "#6b7280" }}>({staff?.length ?? 0})</span></h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm); }}
          style={{ padding: "6px 14px", background: color, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
          {showForm && !editing ? "Cancel" : `+ Add ${title.split(" ")[0]}`}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#f9fafb", borderRadius: 10, padding: 20, marginBottom: 16, border: "1px solid #e5e7eb" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15 }}>{editing ? `Edit ${title.split(" ")[0]}` : `New ${title.split(" ")[0]}`}</h3>
          {formError && <p style={{ color: "#ef4444", fontSize: 13, margin: "0 0 10px" }}>{formError}</p>}
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { name: "name", placeholder: "Full Name", required: true },
              { name: "email", placeholder: "Email", type: "email", required: true },
              { name: "password", placeholder: editing ? "New Password (leave blank to keep)" : "Password", type: "password", required: !editing },
              { name: "phone", placeholder: "Phone (optional)" },
            ].map(f => (
              <input key={f.name} {...f} value={form[f.name]} onChange={handleChange}
                style={{ padding: "9px 12px", borderRadius: 7, border: "1px solid #e5e7eb", fontSize: 13 }} />
            ))}
            <button type="submit" disabled={saving}
              style={{ gridColumn: "1/-1", padding: "9px", background: color, color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13 }}>
              {saving ? "Saving..." : editing ? "Update" : "Create Account"}
            </button>
          </form>
        </div>
      )}

      {loading && <p style={{ color: "#6b7280", fontSize: 13 }}>Loading...</p>}
      {error && <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>}

      <div className="admin-list">
        {staff?.map(s => (
          <div className="admin-list-item" key={s._id}>
            <div>
              <strong>{s.name}</strong>
              <div style={{ color: "#6b7280", fontSize: 12 }}>{s.email} {s.phone ? `· ${s.phone}` : ""}</div>
              <div style={{ color: "#9ca3af", fontSize: 11 }}>Since {new Date(s.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => handleEdit(s)}
                style={{ padding: "4px 11px", borderRadius: 6, border: `1px solid ${color}`, color, background: "transparent", cursor: "pointer", fontSize: 12 }}>Edit</button>
              <button onClick={() => handleDelete(s._id, s.name)}
                style={{ padding: "4px 11px", borderRadius: 6, border: "1px solid #ef4444", color: "#ef4444", background: "transparent", cursor: "pointer", fontSize: 12 }}>Delete</button>
            </div>
          </div>
        ))}
        {!loading && !staff?.length && (
          <p style={{ color: "#6b7280", padding: 12, fontSize: 13 }}>No {title.toLowerCase()} yet.</p>
        )}
      </div>
    </section>
  );
}

export default function StaffPage() {
  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Staff Management</h1><p>Manage counselor and trainer accounts</p></div>
      </div>
      <StaffSection title="Counselors" color="#6366f1"
        fetchFn={getAllCounselors} createFn={createCounselor} updateFn={updateCounselor} deleteFn={deleteCounselor} />
      <StaffSection title="Trainers" color="#0ea5e9"
        fetchFn={getAllTrainers} createFn={createTrainer} updateFn={updateTrainer} deleteFn={deleteTrainer} />
    </div>
  );
}
