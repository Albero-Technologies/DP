import useFetch from "../../hooks/useFetch";
import { getStudentCertificates } from "../../api/students.api";
import useAuth from "../../context/useAuth";

function generateCertificate(user, courseName, batchName, completionDate, isSample = false) {
  const win = window.open("", "_blank");
  win.document.write(`
    <html><head><title>${isSample ? "Sample Certificate" : "Certificate of Completion"}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: "Georgia", serif; background: #fffdf5; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
      .cert { border: 12px solid #6366f1; border-radius: 20px; padding: 60px 80px; max-width: 800px; width: 90%; text-align: center; background: #fff; position: relative; box-shadow: 0 4px 40px rgba(99,102,241,0.15); }
      .cert::before { content: ""; position: absolute; inset: 8px; border: 2px solid #c7d2fe; border-radius: 12px; pointer-events: none; }
      .logo { font-size: 14px; font-weight: 700; color: #6366f1; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 20px; }
      .title { font-size: 38px; color: #6366f1; font-style: italic; margin-bottom: 8px; }
      .subtitle { font-size: 14px; color: #9ca3af; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px; }
      .awarded { font-size: 16px; color: #6b7280; margin-bottom: 8px; }
      .name { font-size: 42px; font-weight: 700; color: #111827; border-bottom: 2px solid #6366f1; display: inline-block; padding-bottom: 8px; margin: 8px 0 24px; }
      .desc { font-size: 15px; color: #6b7280; line-height: 1.6; margin-bottom: 8px; }
      .course { font-size: 24px; font-weight: 700; color: #6366f1; margin: 8px 0 24px; }
      .footer { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
      .sample-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
      .sample-text { font-size: 80px; font-weight: 900; color: rgba(239,68,68,0.12); transform: rotate(-30deg); letter-spacing: 8px; }
    </style></head>
    <body>
      <div class="cert">
        ${isSample ? '<div class="sample-overlay"><div class="sample-text">SAMPLE</div></div>' : ""}
        <div class="logo">🎓 EdTech CRM</div>
        <div class="title">Certificate of Completion</div>
        <div class="subtitle">This is to proudly certify that</div>
        <div class="name">${isSample ? "Your Name Here" : user?.name}</div>
        <div class="desc">has successfully completed the program</div>
        <div class="course">${courseName}</div>
        <div class="desc">Batch: ${batchName}</div>
        <div class="footer">
          <div><strong>Issued On</strong><br/>${completionDate}</div>
          <div style="text-align:center"><strong>Certificate ID</strong><br/>${isSample ? "SAMPLE-CERT" : `CERT-${Math.random().toString(36).slice(2,8).toUpperCase()}`}</div>
          <div style="text-align:right"><strong>EdTech CRM</strong><br/>Authorized Signatory</div>
        </div>
      </div>
      <script>window.print();</script>
    </body></html>
  `);
  win.document.close();
}

export default function CertificatesPage() {
  const { user } = useAuth();
  const { data: certs, loading, error } = useFetch(getStudentCertificates);

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Certificates</h1><p>Your earned certificates and sample preview</p></div>
        <span className="admin-pill">{certs?.length ?? 0} earned</span>
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading...</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      {/* Sample Certificate */}
      <section className="admin-section" style={{ marginBottom: 24 }}>
        <h2>📄 Sample Certificate Preview</h2>
        <p style={{ color: "#6b7280", fontSize: 13, margin: "4px 0 16px" }}>
          This is what your certificate will look like after completing a course.
        </p>
        {/* Visual sample */}
        <div style={{ border: "8px solid #6366f1", borderRadius: 16, padding: "32px 40px", maxWidth: 600, background: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ fontSize: 60, fontWeight: 900, color: "rgba(239,68,68,0.08)", transform: "rotate(-30deg)", letterSpacing: 6 }}>SAMPLE</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", letterSpacing: 3, marginBottom: 12 }}>🎓 EDTECH CRM</div>
          <div style={{ fontSize: 26, color: "#6366f1", fontStyle: "italic", marginBottom: 6 }}>Certificate of Completion</div>
          <div style={{ fontSize: 12, color: "#9ca3af", letterSpacing: 2, marginBottom: 16 }}>THIS IS TO CERTIFY THAT</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#111827", borderBottom: "2px solid #6366f1", display: "inline-block", paddingBottom: 6, marginBottom: 16 }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>has successfully completed</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#6366f1", marginBottom: 16 }}>Your Course Name Here</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
            <span>Issued: {new Date().toLocaleDateString("en-IN")}</span>
            <span>EdTech CRM · Authorized</span>
          </div>
        </div>
        <button onClick={() => generateCertificate(user, "Sample Course", "Sample Batch", new Date().toLocaleDateString("en-IN"), true)}
          style={{ marginTop: 14, padding: "9px 20px", background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
          🖨 Print Sample Certificate
        </button>
      </section>

      {/* Earned Certificates */}
      {certs?.length > 0 && (
        <section className="admin-section">
          <h2>🏆 My Certificates</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20, marginTop: 16 }}>
            {certs.map(enr => (
              <div key={enr._id} style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 16, padding: 28, color: "#fff", textAlign: "center", boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>{enr.batch?.course?.title}</h3>
                <p style={{ opacity: 0.8, fontSize: 13, margin: "0 0 4px" }}>Batch: {enr.batch?.name}</p>
                <p style={{ opacity: 0.7, fontSize: 12, margin: "0 0 20px" }}>{enr.batch?.course?.durationInMonths} months</p>
                <button onClick={() => generateCertificate(user, enr.batch?.course?.title, enr.batch?.name, new Date(enr.updatedAt).toLocaleDateString("en-IN"))}
                  style={{ background: "#fff", color: "#6366f1", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                  ⬇ Download Certificate
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && !certs?.length && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#6b7280" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>No certificates earned yet</p>
          <p style={{ fontSize: 13 }}>Complete your enrolled course to earn your certificate!</p>
        </div>
      )}
    </div>
  );
}