import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Public
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import AnimatedBackground from "./components/AnimatedBackground";
import Aboutus from "./components/Aboutus";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// Programs
import DataAnalyticsPage       from "./pages/programs/DataAnalyticsPage";
import BusinessAnalyticsPage   from "./pages/programs/BusinessAnalyticsPage";
import DataScienceAIPage       from "./pages/programs/DataScienceAIPage";
import AgenticAIPage           from "./pages/programs/AgenticAIPage";
import InvestmentBankingPage   from "./pages/programs/InvestmentBankingPage";
import MastersTrackPage        from "./pages/programs/MastersTrackPage";

// Shared layout
import AdminLayout      from "./pages/admin/AdminLayout";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";

// Admin pages
import DashboardContent from "./pages/admin/DashboardContent";
import CoursesPage      from "./pages/admin/CoursesPage";
import BatchesPage      from "./pages/admin/BatchesPage";
import StudentsPage     from "./pages/admin/StudentsPage";
import PaymentsPage     from "./pages/admin/PaymentsPage";
import DemoCoursesPage  from "./pages/admin/DemoCoursesPage";
import StaffPage        from "./pages/admin/StaffPage";

// Trainer pages  ← TrainerDashboardPage added here
import TrainerDashboardPage from "./pages/trainer/DashboardPage";
import TrainerBatchesPage   from "./pages/trainer/BatchesPage";
import TrainerStudentsPage  from "./pages/trainer/StudentsPage";
import TrainerSessionsPage  from "./pages/trainer/SessionsPage";

// Counselor pages
import CounselorStudentsPage from "./pages/counselor/StudentsPage";
import FollowUpsPage         from "./pages/counselor/FollowUpsPage";
import BatchAssignPage       from "./pages/counselor/BatchAssignPage";
import PaymentApprovalsPage  from "./pages/counselor/PaymentApprovalsPage";
import SupportTicketsPage    from "./pages/counselor/SupportTicketsPage";

// Student pages
import StudentDashboard from "./pages/student/DashboardContent";
import MyCoursesPage       from "./pages/student/MyCoursesPage";
import StudentPaymentsPage from "./pages/student/PaymentsPage";
import CertificatesPage    from "./pages/student/CertificatesPage";
import SupportPage         from "./pages/student/SupportPage";

export default function App() {
  const location = useLocation();
  const hideBackground = ["/admin","/trainer","/counselor","/student"].some(p =>
    location.pathname.startsWith(p)
  );

  return (
    <AuthProvider>
      <ScrollToTop />
      {!hideBackground && <AnimatedBackground />}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          {/* ── Public ── */}
          <Route path="/"                element={<HomePage />} />
          <Route path="/about"           element={<Aboutus />} />
          <Route path="/signin"          element={<SignInPage />} />
          <Route path="/signup"          element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* ── Programs ── */}
          <Route path="/programs/data-analytics"                element={<DataAnalyticsPage />} />
          <Route path="/programs/business-analytics"            element={<BusinessAnalyticsPage />} />
          <Route path="/programs/data-science-ai"               element={<DataScienceAIPage />} />
          <Route path="/programs/agentic-ai-prompt-engineering" element={<AgenticAIPage />} />
          <Route path="/programs/investment-banking"            element={<InvestmentBankingPage />} />
          <Route path="/programs/data-ai-masters-track"         element={<MastersTrackPage />} />

          {/* ── ADMIN ── */}
          <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminLayout role="admin" /></ProtectedRoute>}>
            <Route index         element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"    element={<DashboardContent />} />
            <Route path="courses"      element={<CoursesPage />} />
            <Route path="batches"      element={<BatchesPage />} />
            <Route path="students"     element={<StudentsPage />} />
            <Route path="payments"     element={<PaymentsPage />} />
            <Route path="demo-courses" element={<DemoCoursesPage />} />
            <Route path="staff"        element={<StaffPage />} />
            <Route path="reports"      element={<AdminPlaceholder title="Reports" />} />
          </Route>

          {/* ── TRAINER ── */}
          <Route path="/trainer" element={<ProtectedRoute roles={["TRAINER"]}><AdminLayout role="trainer" /></ProtectedRoute>}>
            <Route index        element={<Navigate to="/trainer/dashboard" replace />} />
            <Route path="dashboard" element={<TrainerDashboardPage />} />  {/* ← fixed */}
            <Route path="cohorts"   element={<TrainerBatchesPage />} />
            <Route path="students"  element={<TrainerStudentsPage />} />
            <Route path="sessions"  element={<TrainerSessionsPage />} />
            <Route path="reports"   element={<AdminPlaceholder title="Reports" />} />
          </Route>

          {/* ── COUNSELOR ── */}
          <Route path="/counselor" element={<ProtectedRoute roles={["COUNSELOR"]}><AdminLayout role="counselor" /></ProtectedRoute>}>
            <Route index         element={<Navigate to="/counselor/dashboard" replace />} />
            <Route path="dashboard"  element={<DashboardContent />} />
            <Route path="students"   element={<CounselorStudentsPage />} />
            <Route path="batches"    element={<BatchAssignPage />} />
            <Route path="follow-ups" element={<FollowUpsPage />} />
            <Route path="payments"   element={<PaymentApprovalsPage />} />
            <Route path="support"    element={<SupportTicketsPage />} />
            <Route path="reports"    element={<AdminPlaceholder title="Reports" />} />
          </Route>

          {/* ── STUDENT ── */}
          <Route path="/student" element={<ProtectedRoute roles={["STUDENT"]}><AdminLayout role="student" /></ProtectedRoute>}>
            <Route index          element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard"    element={<StudentDashboard />} />
            <Route path="courses"      element={<MyCoursesPage />} />
            <Route path="payments"     element={<StudentPaymentsPage />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="support"      element={<SupportPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}