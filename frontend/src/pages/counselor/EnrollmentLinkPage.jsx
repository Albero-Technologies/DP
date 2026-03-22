import { useState, useEffect } from "react";
import API from "../../api/axiosInstance";

export default function EnrollmentLinkPage() {
  const [link,       setLink]       = useState("");
  const [leads,      setLeads]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [converting, setConverting] = useState(null);
  const [deleting,   setDeleting]   = useState(null);
  const [converted,  setConverted]  = useState(null);
  const [copied,     setCopied]     = useState(false);
  const [credCopied, setCredCopied] = useState(false);

  const fetchLeads = () =>
    API.get("/counselor/leads").then(r => setLeads(r.data.data || []));

  useEffect(() => {
    Promise.all([
      API.get("/counselor/enroll-link"),
      API.get("/counselor/leads"),
    ]).then(([linkRes, leadsRes]) => {
      setLink(linkRes.data.link);
      setLeads(leadsRes.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCredentials = () => {
    if (!converted) return;
    const text =
`Student Credentials — EdTech CRM
Name: ${converted.student?.name}
Email: ${converted.student?.email}
Student ID: ${converted.student?.studentId}
Password: ${converted.tempPassword}
Login at: ${window.location.origin}/signin`;
    navigator.clipboard.writeText(text);
    setCredCopied(true);
    setTimeout(() => setCredCopied(false), 2500);
  };

  const shareCredentials = () => {
    if (!converted) return;
    const text =
`*Student Credentials — EdTech CRM*\nName: ${converted.student?.name}\nEmail: ${converted.student?.email}\nStudent ID: ${converted.student?.studentId}\nPassword: ${converted.tempPassword}\nLogin: ${window.location.origin}/signin`;
    if (navigator.share) {
      navigator.share({ title: "Student Credentials", text });
    } else {
      // Fallback: open WhatsApp web
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const convertLead = async (leadId) => {
    setConverting(leadId);
    try {
      const res = await API.post(`/counselor/leads/${leadId}/convert`);
      setConverted(res.data.data);
      setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: "CONVERTED" } : l));
    } catch (err) {
      alert(err?.response?.data?.message || "Conversion failed");
    } finally { setConverting(null); }
  };

  const deleteLead = async (leadId) => {
    if (!window.confirm("Delete this submission? This cannot be undone.")) return;
    setDeleting(leadId);
    try {
      await API.patch(`/counselor/leads/${leadId}`, { status: "DROPPED" });
      setLeads(prev => prev.filter(l => l._id !== leadId));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally { setDeleting(null); }
  };

  const STATUS_COLORS = {
    NEW:       { bg: "#DBEAFE", color: "#1E40AF" },
    CONTACTED: { bg: "#FEF3C7", color: "#92400E" },
    CONVERTED: { bg: "#DCFCE7", color: "#166534" },
    DROPPED:   { bg: "#FEE2E2", color: "#991B1B" },
  };

  if (loading) return <div style={s.loading}>Loading…</div>;

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Enrollment Link</h1>
      <p style={s.sub}>Share this link with prospective students. Only you can see the submissions.</p>

      {/* Link card */}
      <div style={s.linkCard}>
        <div style={s.linkLabel}>Your unique enrollment link</div>
        <div style={s.linkRow}>
          <span style={s.linkText}>{link}</span>
          <button onClick={copyLink} style={s.copyBtn}>
            {copied ? "Copied ✓" : "Copy Link"}
          </button>
        </div>
        <p style={s.linkHint}>Every submission via this link is private to you — no other counselor can access it.</p>
      </div>

      {/* Converted student credentials */}
      {converted && (
        <div style={s.convertedBox}>
          <p style={{ fontWeight: 700, marginBottom: 8, fontSize: "1rem" }}>✅ Student account created!</p>
          <p style={{ margin: "3px 0" }}>Name: <b>{converted.student?.name}</b></p>
          <p style={{ margin: "3px 0" }}>Email: <b>{converted.student?.email}</b></p>
          <p style={{ margin: "3px 0" }}>Student ID: <b style={{ color: "#1429D0" }}>{converted.student?.studentId}</b></p>
          <p style={{ margin: "3px 0" }}>Temp Password: <b style={{ color: "#1429D0", fontSize: "1.05rem" }}>{converted.tempPassword}</b></p>
          <p style={{ fontSize: "0.78rem", color: "#64748B", margin: "8px 0 12px" }}>
            ⚠ Share these credentials now — you won't see the password again after dismissing.
          </p>
          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={copyCredentials} style={s.credBtn}>
              {credCopied ? "✓ Copied!" : "📋 Copy Credentials"}
            </button>
            <button onClick={shareCredentials} style={{ ...s.credBtn, background: "#25D366", borderColor: "#25D366" }}>
              📤 Share via WhatsApp
            </button>
            <button onClick={() => setConverted(null)} style={s.dismissBtn}>Dismiss</button>
          </div>
        </div>
      )}

      {/* Leads table */}
      <h2 style={s.h2}>Submissions ({leads.filter(l => l.status !== "DROPPED").length})</h2>
      {leads.filter(l => l.status !== "DROPPED").length === 0 ? (
        <p style={{ color: "#94A3B8", fontSize: "0.9rem" }}>No submissions yet. Share your link to get started.</p>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>{["Name", "Phone", "Email", "Status", "Date", "Action"].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {leads.filter(l => l.status !== "DROPPED").map(lead => (
                <tr key={lead._id} style={s.tr}>
                  <td style={s.td}>
                    <div style={{ fontWeight: 600 }}>{lead.name}</div>
                    {lead.fatherName && <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>F: {lead.fatherName}</div>}
                  </td>
                  <td style={s.td}>{lead.phone}</td>
                  <td style={s.td}>{lead.email || "—"}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...(STATUS_COLORS[lead.status] || {}) }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={s.td}>{new Date(lead.createdAt).toLocaleDateString("en-IN")}</td>
                  <td style={s.td}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {lead.status !== "CONVERTED" ? (
                        <>
                          <button
                            onClick={() => convertLead(lead._id)}
                            disabled={converting === lead._id}
                            style={s.convertBtn}>
                            {converting === lead._id ? "…" : "Create Student"}
                          </button>
                          {/* Delete — only for non-converted */}
                          <button
                            onClick={() => deleteLead(lead._id)}
                            disabled={deleting === lead._id}
                            style={s.deleteBtn}>
                            {deleting === lead._id ? "…" : "🗑"}
                          </button>
                        </>
                      ) : (
                        <span style={{ color: "#16A34A", fontSize: "0.8rem", fontWeight: 600 }}>✓ Enrolled</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s = {
  page:         { padding: "1.5rem 2rem", maxWidth: 960, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" },
  loading:      { padding: "3rem", textAlign: "center", color: "#94A3B8" },
  h1:           { fontSize: "1.5rem", fontWeight: 800, color: "#161619", marginBottom: 4 },
  h2:           { fontSize: "1.1rem", fontWeight: 700, color: "#262832", margin: "2rem 0 0.75rem" },
  sub:          { color: "#64748B", fontSize: "0.9rem", marginBottom: "1.5rem" },
  linkCard:     { background: "#F2F5FF", border: "1.5px solid rgba(20,41,208,0.15)", borderRadius: 14, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" },
  linkLabel:    { fontSize: "0.72rem", fontWeight: 700, color: "#1429D0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  linkRow:      { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  linkText:     { fontSize: "0.88rem", color: "#262832", wordBreak: "break-all", flex: 1 },
  copyBtn:      { padding: "0.45rem 1rem", background: "#1429D0", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, whiteSpace: "nowrap" },
  linkHint:     { fontSize: "0.76rem", color: "#94A3B8", marginTop: 8 },
  convertedBox: { background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 12, padding: "1.1rem 1.25rem", marginBottom: "1.5rem", fontSize: "0.9rem", color: "#166534" },
  credBtn:      { padding: "0.45rem 1rem", background: "#1429D0", color: "#fff", border: "1px solid #1429D0", borderRadius: 7, cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 },
  dismissBtn:   { padding: "0.4rem 0.9rem", background: "transparent", border: "1px solid #86EFAC", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem", color: "#166534" },
  tableWrap:    { overflowX: "auto", borderRadius: 12, border: "1px solid #E2E8F0" },
  table:        { width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" },
  th:           { padding: "0.75rem 1rem", background: "#F8FAFC", textAlign: "left", fontWeight: 700, color: "#64748B", fontSize: "0.75rem", borderBottom: "1px solid #E2E8F0" },
  tr:           { borderBottom: "1px solid #F1F5F9" },
  td:           { padding: "0.75rem 1rem", color: "#262832", verticalAlign: "middle" },
  badge:        { fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 100 },
  convertBtn:   { padding: "0.35rem 0.75rem", background: "#1429D0", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 },
  deleteBtn:    { padding: "0.35rem 0.5rem", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem" },
};