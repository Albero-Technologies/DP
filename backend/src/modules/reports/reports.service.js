import User from "../users/user.model.js";
import Course from "../courses/course.model.js";
import Batch from "../batches/batch.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import Invoice from "../finance/invoice.model.js";
import { ROLES } from "../../config/constants.js";
import Payment from "../finance/payment.model.js";

// ── Admin dashboard ──────────────────────────────────────────
export const getAdminDashboardStats = async () => {
  const totalStudents    = await User.countDocuments({ role: ROLES.STUDENT });
  const totalCourses     = await Course.countDocuments();
  const activeBatches    = await Batch.countDocuments({ isActive: true });
  const totalEnrollments = await Enrollment.countDocuments();

  const financeStats = await Invoice.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$amountPaid" }, totalPending: { $sum: { $subtract: ["$totalAmount", "$amountPaid"] } } } },
  ]);

  const totalRevenueCollected = financeStats[0]?.totalRevenue || 0;
  const totalPendingRevenue   = financeStats[0]?.totalPending  || 0;

  const monthlyRevenue = await Payment.aggregate([
    { $group: { _id: { $month: "$createdAt" }, revenue: { $sum: "$amount" } } },
    { $sort: { "_id": 1 } },
  ]);

  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
    month: monthNames[item._id],
    revenue: item.revenue,
  }));

  return { totalStudents, totalCourses, activeBatches, totalEnrollments, totalRevenueCollected, totalPendingRevenue, monthlyRevenue: formattedMonthlyRevenue };
};

// ── Trainer dashboard ────────────────────────────────────────
export const getTrainerDashboardStats = async (trainerId) => {
  const batches     = await Batch.find({ $or: [{ trainer: trainerId }, { trainers: trainerId }] });
  const batchIds    = batches.map(b => b._id);
  const totalStudents = await Enrollment.countDocuments({ batch: { $in: batchIds } });
  const activeBatches = batches.filter(b => b.isActive).length;
  const batchWiseStats = await Enrollment.aggregate([
    { $match: { batch: { $in: batchIds } } },
    { $group: { _id: "$batch", studentCount: { $sum: 1 } } },
  ]);
  return { totalAssignedBatches: batches.length, activeBatches, totalStudents, batchWiseStats };
};

// ── Counselor dashboard — ONLY this counselor's data ────────
export const getCounselorDashboardStats = async (counselorId) => {
  // 1. My students (assigned to this counselor)
  const myStudents = await User.find({
    role: ROLES.STUDENT,
    assignedCounselor: counselorId,
  }).select("_id");
  const myStudentIds = myStudents.map(s => s._id);

  // 2. Enrollments of my students
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const totalEnrollments = await Enrollment.countDocuments({
    student: { $in: myStudentIds },
  });

  const enrollmentsThisMonth = await Enrollment.countDocuments({
    student:   { $in: myStudentIds },
    createdAt: { $gte: startOfMonth },
  });

  // 3. Invoices — both enrollment-based AND demo (meta.studentId)
  const myEnrollments = await Enrollment.find({ student: { $in: myStudentIds } }).select("_id");
  const myEnrollmentIds = myEnrollments.map(e => e._id);

  const pendingInvoices = await Invoice.countDocuments({
    $or: [
      { enrollment: { $in: myEnrollmentIds }, status: { $ne: "PAID" } },
      { "meta.studentId": { $in: myStudentIds }, status: { $ne: "PAID" } },
    ],
  });

  // 4. Revenue — enrollment invoices + DEMO invoices
  const [enrollStats, demoStats] = await Promise.all([
    Invoice.aggregate([
      { $match: { enrollment: { $in: myEnrollmentIds } } },
      { $group: { _id: null, totalRevenue: { $sum: "$amountPaid" } } },
    ]),
    Invoice.aggregate([
      { $match: { "meta.studentId": { $in: myStudentIds } } },
      { $group: { _id: null, totalRevenue: { $sum: "$amountPaid" } } },
    ]),
  ]);

  const totalRevenueCollected = (enrollStats[0]?.totalRevenue || 0) + (demoStats[0]?.totalRevenue || 0);
  const totalMyStudents       = myStudents.length;

  return {
    totalMyStudents,
    totalEnrollments,
    enrollmentsThisMonth,
    pendingInvoices,
    totalRevenueCollected,
  };
};

// ── Student dashboard ────────────────────────────────────────
export const getStudentDashboardStats = async (studentId) => {
  const enrollment = await Enrollment.findOne({ student: studentId })
    .populate({ path: "batch", populate: { path: "course", select: "title durationInMonths fees" } });

  if (!enrollment) return { message: "No enrollment found" };

  const invoice  = await Invoice.findOne({ enrollment: enrollment._id });
  const payments = invoice ? await Payment.find({ invoice: invoice._id }) : [];

  return {
    enrollment,
    invoiceStatus:    invoice ? invoice.status : "NO_INVOICE",
    totalAmount:      invoice?.totalAmount || 0,
    totalPaid:        invoice?.amountPaid  || 0,
    remainingBalance: (invoice?.totalAmount || 0) - (invoice?.amountPaid || 0),
    payments,
  };
};