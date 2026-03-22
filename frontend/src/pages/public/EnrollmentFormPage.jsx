import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function EnrollmentFormPage() {
  const { counselorId } = useParams();
  const [form, setForm] = useState({ name: "", fatherName: "", address: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API}/counselor/enroll/${counselorId}`, form);
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>Details Submitted!</h2>
          <p style={styles.successMsg}>
            Thank you! Our counselor will contact you shortly to guide you through the enrollment process.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          Data<span style={{ color: "#1429D0" }}>Preneur</span>
        </div>
        <h1 style={styles.title}>Start Your Journey</h1>
        <p style={styles.subtitle}>Fill in your details and our team will reach out to you.</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { name: "name",       label: "Full Name *",    type: "text",  placeholder: "Your full name",   required: true },
            { name: "fatherName", label: "Father's Name",  type: "text",  placeholder: "Father's name",    required: false },
            { name: "phone",      label: "Phone Number *", type: "tel",   placeholder: "+91 9XXXXXXXX",    required: true },
            { name: "email",      label: "Email Address",  type: "email", placeholder: "you@email.com",    required: false },
            { name: "address",    label: "Address",        type: "text",  placeholder: "Your address",     required: false },
          ].map(field => (
            <div key={field.name} style={styles.fieldGroup}>
              <label style={styles.label}>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                style={styles.input}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Submitting…" : "Submit Details →"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", background: "#F5F7FA",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "2rem 1rem", fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: "#fff", borderRadius: 20, padding: "2.5rem 2rem",
    width: "100%", maxWidth: 480,
    boxShadow: "0 8px 40px rgba(20,41,208,0.10)",
    border: "1.5px solid rgba(20,41,208,0.10)",
  },
  brand: { fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-0.04em", color: "#161619", marginBottom: "1.5rem" },
  title: { fontSize: "1.5rem", fontWeight: 800, color: "#161619", margin: "0 0 0.4rem" },
  subtitle: { fontSize: "0.92rem", color: "#64748B", margin: "0 0 1.5rem" },
  error: { background: "#FEE2E2", color: "#991B1B", borderRadius: 8, padding: "0.6rem 1rem", fontSize: "0.85rem", marginBottom: "1rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: "0.75rem", fontWeight: 600, color: "#262832" },
  input: {
    padding: "0.75rem 0.9rem", fontSize: "1rem", fontFamily: "'DM Sans', sans-serif",
    border: "1.5px solid rgba(20,41,208,0.15)", borderRadius: 8,
    color: "#161619", outline: "none", background: "#fff",
  },
  btn: {
    marginTop: "0.5rem", padding: "0.8rem", borderRadius: 10, border: "none",
    background: "#1429D0", color: "#fff", fontSize: "0.95rem",
    fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 4px 16px rgba(20,41,208,0.25)",
  },
  successIcon: {
    width: 56, height: 56, borderRadius: "50%", background: "#DCFCE7",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 28, color: "#16A34A", margin: "0 auto 1rem",
  },
  successTitle: { textAlign: "center", fontWeight: 800, fontSize: "1.3rem", color: "#161619", margin: "0 0 0.5rem" },
  successMsg: { textAlign: "center", color: "#64748B", fontSize: "0.92rem", lineHeight: 1.6 },
};