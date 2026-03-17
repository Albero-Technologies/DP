import { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import { getAdminDashboard, getTrainerDashboard, getCounselorDashboard, getStudentDashboard } from "../../api/reports.api";
import DemoCoursesSection from "../student/DemoCoursesSection";

const dashboardFnMap = { ADMIN: getAdminDashboard, TRAINER: getTrainerDashboard, COUNSELOR: getCounselorDashboard, STUDENT: getStudentDashboard };

export default function DashboardContent() {
  const { user } = useAuth();
  const role = user?.role || "ADMIN";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fn = dashboardFnMap[role];
    if (!fn) return;
    fn().then(res => setData(res.data)).catch(err => setError(err.response?.data?.message || "Failed to load")).finally(() => setLoading(false));
  }, [role]);

  const titles = {
    ADMIN:    { title: "Admin Dashboard",    subtitle: "Monitor performance, revenue, and institute engagement in real time." },
    TRAINER:  { title: "Trainer Dashboard",  subtitle: "Track cohort progress, attendance, and learner outcomes." },
    COUNSELOR:{ title: "Counselor Dashboard",subtitle: "Manage students, leads, conversions, and learner engagement." },
    STUDENT:  { title: "Student Dashboard",  subtitle: "Keep up with courses, payments, and progress milestones." },
  };
  const { title, subtitle } = titles[role] || titles.ADMIN;

  return (
    <div>
      <div className="admin-page-header"><div><h1>{title}</h1><p>{subtitle}</p></div></div>

      {loading && <div className="admin-metrics">{[1,2,3].map(i => <div key={i} className="admin-card" style={{opacity:0.4}}><h3>Loading...</h3><div className="admin-metric-value">—</div></div>)}</div>}
      {error && <div style={{color:"#ef4444",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"14px 18px",marginBottom:20}}>{error}</div>}

      {data && role === "ADMIN" && (
        <>
          <div className="admin-metrics">
            <div className="admin-card admin-card--indigo"><h3>Total Students</h3><div className="admin-metric-value">{data.totalStudents ?? 0}</div><div className="admin-pill">Registered</div></div>
            <div className="admin-card"><h3>Total Courses</h3><div className="admin-metric-value">{data.totalCourses ?? 0}</div><div className="admin-pill">Active programs</div></div>
            <div className="admin-card admin-card--teal"><h3>Total Enrollments</h3><div className="admin-metric-value">{data.totalEnrollments ?? 0}</div><div className="admin-pill">All time</div></div>
            <div className="admin-card"><h3>Active Batches</h3><div className="admin-metric-value">{data.activeBatches ?? 0}</div><div className="admin-pill">Running now</div></div>
            <div className="admin-card admin-card--indigo"><h3>Revenue Collected</h3><div className="admin-metric-value">₹{(data.totalRevenueCollected ?? 0).toLocaleString()}</div><div className="admin-pill">₹{(data.totalPendingRevenue ?? 0).toLocaleString()} pending</div></div>
          </div>
          {data.monthlyRevenue?.length > 0 && (
            <section className="admin-section" style={{marginTop:24}}>
              <h2>Monthly Revenue</h2>
              <div className="admin-list">{data.monthlyRevenue.map((item,i) => <div className="admin-list-item" key={i}><strong>{item.month}</strong><span className="admin-pill">₹{item.revenue?.toLocaleString()}</span></div>)}</div>
            </section>
          )}
        </>
      )}

      {data && role === "TRAINER" && (
        <div className="admin-metrics">
          <div className="admin-card admin-card--indigo"><h3>Assigned Batches</h3><div className="admin-metric-value">{data.totalAssignedBatches ?? 0}</div><div className="admin-pill">{data.activeBatches ?? 0} active</div></div>
          <div className="admin-card"><h3>Total Students</h3><div className="admin-metric-value">{data.totalStudents ?? 0}</div><div className="admin-pill">Across all batches</div></div>
        </div>
      )}

      {data && role === "COUNSELOR" && (
        <div className="admin-metrics">
          <div className="admin-card admin-card--indigo"><h3>Total Enrollments</h3><div className="admin-metric-value">{data.totalEnrollments ?? 0}</div><div className="admin-pill">{data.enrollmentsThisMonth ?? 0} this month</div></div>
          <div className="admin-card"><h3>Pending Invoices</h3><div className="admin-metric-value">{data.pendingInvoices ?? 0}</div><div className="admin-pill">Needs follow-up</div></div>
          <div className="admin-card admin-card--teal"><h3>Revenue Collected</h3><div className="admin-metric-value">₹{(data.totalRevenueCollected ?? 0).toLocaleString()}</div><div className="admin-pill">Total collected</div></div>
        </div>
      )}

      {data && role === "STUDENT" && (
        <>
          {data.message ? (
            <div style={{padding:24,background:"#f0fdf4",borderRadius:10,color:"#16a34a",marginBottom:24}}>
              <strong>{data.message}</strong> — Please contact your counselor to get enrolled.
            </div>
          ) : (
            <div className="admin-metrics" style={{marginBottom:24}}>
              <div className="admin-card admin-card--indigo"><h3>Course</h3><div className="admin-metric-value" style={{fontSize:18}}>{data.enrollment?.batch?.course?.title ?? "—"}</div><div className="admin-pill">{data.enrollment?.status}</div></div>
              <div className="admin-card"><h3>Amount Paid</h3><div className="admin-metric-value">₹{(data.totalPaid ?? 0).toLocaleString()}</div><div className="admin-pill">of ₹{(data.totalAmount ?? 0).toLocaleString()}</div></div>
              <div className="admin-card admin-card--teal"><h3>Balance Due</h3><div className="admin-metric-value">₹{(data.remainingBalance ?? 0).toLocaleString()}</div><div className="admin-pill">{data.invoiceStatus}</div></div>
            </div>
          )}
          <DemoCoursesSection />
        </>
      )}
    </div>
  );
}
