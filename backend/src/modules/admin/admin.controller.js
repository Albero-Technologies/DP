import User from "../users/user.model.js";
import Invoice from "../finance/invoice.model.js";
import Payment from "../finance/payment.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import Batch from "../batches/batch.model.js";
import Course from "../courses/course.model.js";
import DemoCourse from "../demo-courses/demo-course.model.js";
import Notification from "../notifications/notification.model.js";
import { ROLES } from "../../config/constants.js";
import bcrypt from "bcryptjs";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD STATS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents, totalCourses, totalEnrollments,
      activeBatches, revenueData, monthlyData,
    ] = await Promise.all([
      User.countDocuments({ role: ROLES.STUDENT }),
      Course.countDocuments({ isActive: true }),
      Enrollment.countDocuments({ status: "ACTIVE" }),
      Batch.countDocuments({ isActive: true }),
      Payment.aggregate([
        { $match: { approvalStatus: "APPROVED" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Payment.aggregate([
        { $match: { approvalStatus: "APPROVED" } },
        {
          $group: {
            _id: { year: { $year: "$paidAt" }, month: { $month: "$paidAt" } },
            revenue: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        activeBatches,
        totalRevenue: revenueData[0]?.total || 0,
        monthlyRevenue: monthlyData,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COURSE VIDEO MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// POST /api/admin/courses/:courseId/videos
export const addCourseVideo = async (req, res) => {
  try {
    const { title, url, order } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { $push: { videos: { title, url, order: order || 0 } } },
      { new: true }
    );
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Notify all counselors about new content
    const counselors = await User.find({ role: ROLES.COUNSELOR, isActive: true });
    const notifs = counselors.map(c => ({
      recipient: c._id,
      title: "New Course Video Added",
      message: `A new video "${title}" was added to course: ${course.title}`,
      type: "CONTENT",
      relatedEntity: course._id,
      relatedModel: "Course",
    }));
    if (notifs.length) await Notification.insertMany(notifs);

    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/courses/:courseId/videos/:videoId
export const deleteCourseVideo = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { $pull: { videos: { _id: req.params.videoId } } },
      { new: true }
    );
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEMO COURSE VIDEO MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const addDemoCourseVideo = async (req, res) => {
  try {
    const { title, url, order } = req.body;
    const demo = await DemoCourse.findByIdAndUpdate(
      req.params.demoId,
      { $push: { videos: { title, url, order: order || 0 } } },
      { new: true }
    );
    if (!demo) return res.status(404).json({ success: false, message: "Demo course not found" });
    res.json({ success: true, data: demo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDemoCourseVideo = async (req, res) => {
  try {
    const demo = await DemoCourse.findByIdAndUpdate(
      req.params.demoId,
      { $pull: { videos: { _id: req.params.videoId } } },
      { new: true }
    );
    if (!demo) return res.status(404).json({ success: false, message: "Demo course not found" });
    res.json({ success: true, data: demo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STUDENT DISCOUNT PER COURSE ENROLLMENT
// PATCH /api/admin/enrollments/:enrollmentId/discount
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const setStudentDiscount = async (req, res) => {
  try {
    const { discountAmount } = req.body;
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.enrollmentId,
      { discountAmount },
      { new: true }
    ).populate("student", "name email").populate("batch");
    if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found" });

    // Update corresponding invoice totalAmount
    const invoice = await Invoice.findOne({ enrollment: enrollment._id });
    if (invoice) {
      const batch = await Batch.findById(enrollment.batch).populate("course");
      const baseFees = batch?.course?.fees || 0;
      invoice.totalAmount = Math.max(0, baseFees - discountAmount);
      await invoice.save();
    }

    res.json({ success: true, data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MULTI-TRAINER BATCH ASSIGNMENT
// POST /api/admin/batches/:batchId/trainers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const assignTrainersToBatch = async (req, res) => {
  try {
    const { trainerIds } = req.body; // array
    const batch = await Batch.findByIdAndUpdate(
      req.params.batchId,
      { trainers: trainerIds, trainer: trainerIds[0] },
      { new: true }
    ).populate("trainers", "name email").populate("course", "title");
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

    // Notify each trainer
    const notifs = trainerIds.map(tid => ({
      recipient: tid,
      title: "Batch Assigned",
      message: `You have been assigned to batch: ${batch.name} (${batch.course?.title})`,
      type: "SESSION",
      relatedEntity: batch._id,
      relatedModel: "Batch",
    }));
    if (notifs.length) await Notification.insertMany(notifs);

    res.json({ success: true, data: batch });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STUDENT ACCESS STATUS UPDATE
// PATCH /api/admin/students/:id/access
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const updateStudentAccess = async (req, res) => {
  try {
    const { accessStatus } = req.body;
    if (!["INACTIVE", "TRIAL", "ACTIVE"].includes(accessStatus))
      return res.status(400).json({ success: false, message: "Invalid accessStatus" });

    const student = await User.findByIdAndUpdate(
      req.params.id,
      { accessStatus },
      { new: true }
    ).select("-password");
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    // Notify student of access change
    await Notification.create({
      recipient: student._id,
      title: "Access Updated",
      message:
        accessStatus === "ACTIVE"
          ? "Your full course access has been activated!"
          : accessStatus === "TRIAL"
          ? "Demo course videos are now unlocked for you."
          : "Your course access has been updated.",
      type: "ACCESS",
      relatedEntity: student._id,
    });

    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAYMENTS — edit + delete (in addition to existing)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const editPayment = async (req, res) => {
  try {
    const allowed = ["amount", "paymentMethod", "transactionId", "paidAt"];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const payment = await Payment.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate({ path: "invoice", populate: { path: "enrollment", populate: { path: "student", select: "name email" } } });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    res.json({ success: true, data: payment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    // Adjust invoice amountPaid
    const invoice = await Invoice.findById(payment.invoice);
    if (invoice) {
      invoice.amountPaid = Math.max(0, invoice.amountPaid - payment.amount);
      invoice.status = invoice.amountPaid >= invoice.totalAmount
        ? "PAID"
        : invoice.amountPaid > 0
        ? "PARTIAL"
        : "DUE";
      await invoice.save();
    }
    res.json({ success: true, message: "Payment deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXISTING — Counselor + Trainer CRUD (unchanged, re-exported)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const createCounselor = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "Email already in use" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: ROLES.COUNSELOR, phone });
    res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};
export const getAllCounselors = async (req, res) => {
  try {
    const counselors = await User.find({ role: ROLES.COUNSELOR }).select("-password").sort("-createdAt");
    res.json({ success: true, data: counselors });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
export const updateCounselor = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (password) rest.password = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate({ _id: req.params.id, role: ROLES.COUNSELOR }, rest, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Counselor not found" });
    res.json({ success: true, data: user });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};
export const deleteCounselor = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: ROLES.COUNSELOR });
    if (!user) return res.status(404).json({ success: false, message: "Counselor not found" });
    res.json({ success: true, message: "Counselor deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
export const createTrainer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "Email already in use" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: ROLES.TRAINER, phone });
    res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: ROLES.TRAINER }).select("-password").sort("-createdAt");
    res.json({ success: true, data: trainers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
export const updateTrainer = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (password) rest.password = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate({ _id: req.params.id, role: ROLES.TRAINER }, rest, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Trainer not found" });
    res.json({ success: true, data: user });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};
export const deleteTrainer = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: ROLES.TRAINER });
    if (!user) return res.status(404).json({ success: false, message: "Trainer not found" });
    res.json({ success: true, message: "Trainer deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({ path: "invoice", populate: { path: "enrollment", populate: [{ path: "student", select: "name email phone studentId" }, { path: "batch", populate: { path: "course", select: "title" } }] } })
      .sort("-createdAt");
    res.json({ success: true, data: payments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
export const getPaymentsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Enrollment-based invoices
    const enrollments = await Enrollment.find({ student: studentId });
    const enrollInvoices = await Invoice.find({ enrollment: { $in: enrollments.map(e => e._id) } })
      .populate({ path: "enrollment", populate: { path: "batch", populate: { path: "course", select: "title" } } });

    // DEMO invoices (no enrollment)
    const demoInvoices = await Invoice.find({ "meta.studentId": studentId });

    const allInvoices = [...enrollInvoices, ...demoInvoices];
    const payments = await Payment.find({ invoice: { $in: allInvoices.map(i => i._id) } })
      .populate("invoice").sort("-createdAt");

    res.json({ success: true, data: { invoices: allInvoices, payments } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["APPROVED", "REJECTED", "PENDING"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });
    const updateData = { approvalStatus: status };
    const userId = req.user._id || req.user.id;
    if (userId && userId !== "admin-env") updateData.approvedBy = userId;
    const payment = await Payment.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    // If approved, update student accessStatus
    if (status === "APPROVED") {
      const invoice = await Invoice.findById(payment.invoice).populate({ path: "enrollment", populate: "student" });
      if (invoice?.enrollment?.student) {
        const student = invoice.enrollment.student;
        const allPayments = await Payment.find({ invoice: { $in: (await Invoice.find({ enrollment: { $in: (await Enrollment.find({ student: student._id })).map(e => e._id) } })).map(i => i._id) }, approvalStatus: "APPROVED" });
        const totalPaid = allPayments.reduce((s, p) => s + p.amount, 0);
        const invoiceTotal = invoice.totalAmount;
        let newStatus = "TRIAL";
        if (totalPaid >= invoiceTotal) newStatus = "ACTIVE";
        await User.findByIdAndUpdate(student._id, { accessStatus: newStatus });

        await Notification.create({
          recipient: student._id,
          title: "Payment Approved",
          message: `Your payment of ₹${payment.amount} has been approved. ${newStatus === "ACTIVE" ? "Full access unlocked!" : "Demo videos unlocked!"}`,
          type: "PAYMENT",
          relatedEntity: payment._id,
        });
      }
    }
    res.json({ success: true, data: payment });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};