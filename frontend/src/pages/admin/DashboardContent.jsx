import { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import {
  getAdminDashboard,
  getTrainerDashboard,
  getCounselorDashboard,
  getStudentDashboard,
} from "../../api/reports.api";
import DemoCoursesSection from "../student/DemoCoursesSection";
import {
  Users,
  BookOpen,
  ClipboardList,
  Layers,
  IndianRupee,
  AlertCircle,
  GraduationCap,
  Wallet,
  ReceiptText,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";

const dashboardFnMap = {
  ADMIN:     getAdminDashboard,
  TRAINER:   getTrainerDashboard,
  COUNSELOR: getCounselorDashboard,
  STUDENT:   getStudentDashboard,
};

export default function DashboardContent() {
  const { user } = useAuth();
  const role = user?.role || "ADMIN";
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fn = dashboardFnMap[role];
    if (!fn) return;
    fn()
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [role]);

  const titles = {
    ADMIN:     { title: "Admin Dashboard",     subtitle: "Monitor performance, revenue, and institute engagement in real time." },
    TRAINER:   { title: "Trainer Dashboard",   subtitle: "Track cohort progress, attendance, and learner outcomes." },
    COUNSELOR: { title: "Counselor Dashboard", subtitle: "Manage students, leads, conversions, and learner engagement." },
    STUDENT:   { title: "Student Dashboard",   subtitle: "Keep up with courses, payments, and progress milestones." },
  };
  const { title, subtitle } = titles[role] || titles.ADMIN;

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      {/* Skeleton loading */}
      {loading && (
        <div className="admin-metrics">
          {[1, 2, 3].map(i => (
            <div key={i} className="admin-card admin-card--skeleton" style={{ opacity: 0.5 }}>
              <h3>Loading...</h3>
              <div className="admin-metric-value">—</div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          color: "#DC2626", background: "#FEF2F2",
          border: "1px solid #FECACA", borderRadius: 10,
          padding: "13px 18px", marginBottom: 20, fontSize: 13.5,
        }}>
          <AlertCircle size={17} strokeWidth={2} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* ── ADMIN ── */}
      {data && role === "ADMIN" && (
        <>
          <div className="admin-metrics">
            <MetricCard icon={Users}         iconColor="#1429D0" variant="indigo" label="Total Students"    value={data.totalStudents ?? 0}                              pill="Registered" />
            <MetricCard icon={BookOpen}       iconColor="#0E7FDD" label="Total Courses"     value={data.totalCourses ?? 0}                               pill="Active programs" />
            <MetricCard icon={ClipboardList}  iconColor="#0891b2" variant="teal"   label="Total Enrollments" value={data.totalEnrollments ?? 0}                           pill="All time" />
            <MetricCard icon={Layers}         iconColor="#7c3aed" label="Active Batches"    value={data.activeBatches ?? 0}                              pill="Running now" />
            <MetricCard icon={IndianRupee}    iconColor="#1429D0" variant="indigo" label="Revenue Collected" value={`₹${(data.totalRevenueCollected ?? 0).toLocaleString()}`} pill={`₹${(data.totalPendingRevenue ?? 0).toLocaleString()} pending`} />
          </div>

          {data.monthlyRevenue?.length > 0 && (
            <section className="admin-section">
              <h2>
                <TrendingUp size={15} strokeWidth={2} style={{ display: "inline", marginRight: 6, verticalAlign: "middle", color: "#1429D0" }} />
                Monthly Revenue
              </h2>
              <div className="admin-list">
                {data.monthlyRevenue.map((item, i) => (
                  <div className="admin-list-item" key={i}>
                    <strong>{item.month}</strong>
                    <span className="admin-pill">₹{item.revenue?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ── TRAINER ── */}
      {data && role === "TRAINER" && (
        <div className="admin-metrics">
          <MetricCard icon={CalendarCheck} iconColor="#1429D0" variant="indigo" label="Assigned Batches" value={data.totalAssignedBatches ?? 0} pill={`${data.activeBatches ?? 0} active`} />
          <MetricCard icon={Users}         iconColor="#0891b2" label="Total Students"   value={data.totalStudents ?? 0}          pill="Across all batches" />
        </div>
      )}

      {/* ── COUNSELOR ── */}
      {data && role === "COUNSELOR" && (
        <div className="admin-metrics">
          <MetricCard icon={ClipboardList} iconColor="#1429D0" variant="indigo" label="Total Enrollments"  value={data.totalEnrollments ?? 0}                               pill={`${data.enrollmentsThisMonth ?? 0} this month`} />
          <MetricCard icon={ReceiptText}   iconColor="#d97706" label="Pending Invoices"  value={data.pendingInvoices ?? 0}                                pill="Needs follow-up" />
          <MetricCard icon={IndianRupee}   iconColor="#0891b2" variant="teal"   label="Revenue Collected" value={`₹${(data.totalRevenueCollected ?? 0).toLocaleString()}`} pill="Total collected" />
        </div>
      )}

      {/* ── STUDENT ── */}
      {data && role === "STUDENT" && (
        <>
          {data.message ? (
            <div className="admin-info-banner">
              <strong>{data.message}</strong> — Please contact your counselor to get enrolled.
            </div>
          ) : (
            <div className="admin-metrics" style={{ marginBottom: 24 }}>
              <MetricCard icon={GraduationCap} iconColor="#1429D0" variant="indigo" label="Course"        value={data.enrollment?.batch?.course?.title ?? "—"} valueSmall pill={data.enrollment?.status} />
              <MetricCard icon={Wallet}         iconColor="#0891b2" label="Amount Paid"   value={`₹${(data.totalPaid ?? 0).toLocaleString()}`}             pill={`of ₹${(data.totalAmount ?? 0).toLocaleString()}`} />
              <MetricCard icon={ReceiptText}    iconColor="#0E7FDD" variant="teal"   label="Balance Due"   value={`₹${(data.remainingBalance ?? 0).toLocaleString()}`}    pill={data.invoiceStatus} />
            </div>
          )}
          <DemoCoursesSection />
        </>
      )}
    </div>
  );
}

/* ── Reusable metric card (internal, no logic) ── */
function MetricCard({ icon: Icon, iconColor, variant, label, value, pill, valueSmall }) {
  return (
    <div className={`admin-card${variant ? ` admin-card--${variant}` : ""}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3>{label}</h3>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: `${iconColor}14`,
          border: `1px solid ${iconColor}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: iconColor, flexShrink: 0,
        }}>
          <Icon size={16} strokeWidth={1.9} />
        </div>
      </div>
      <div className="admin-metric-value" style={valueSmall ? { fontSize: 17, letterSpacing: "-0.3px" } : {}}>
        {value}
      </div>
      {pill && <div className="admin-pill">{pill}</div>}
    </div>
  );
}