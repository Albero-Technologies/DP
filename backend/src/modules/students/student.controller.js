import User from "../users/user.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import Invoice from "../finance/invoice.model.js";
import Payment from "../finance/payment.model.js";
import Batch from "../batches/batch.model.js";
import Notification from "../notifications/notification.model.js";
import { ROLES } from "../../config/constants.js";
import mongoose from "mongoose";

// GET /api/students — all students (admin)
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: ROLES.STUDENT }).select("-password").sort("-createdAt");
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select("-password");
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { password, role, ...updateData } = req.body;
    const student = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/student/courses — enrolled courses
export const getStudentCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: "batch",
        populate: [
          { path: "course", select: "title description durationInMonths fees youtubeLink" },
          { path: "trainer", select: "name email" },
        ],
      });
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/student/available-batches — all active paid batches student can enroll in
export const getAvailableBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ isActive: true })
      .populate("course", "title description fees durationInMonths youtubeLink")
      .populate("trainer", "name email")
      .sort("-createdAt");

    // Get student's existing enrollments to mark already enrolled
    const enrollments = await Enrollment.find({ student: req.user._id });
    const enrolledBatchIds = new Set(enrollments.map(e => e.batch.toString()));

    const result = batches.map(b => ({
      ...b.toObject(),
      isEnrolled: enrolledBatchIds.has(b._id.toString()),
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/student/self-enroll — student requests enrollment
export const selfEnroll = async (req, res) => {
  try {
    const { batchId } = req.body;
    const studentId = req.user._id;

    const batch = await Batch.findById(batchId).populate("course");
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

    const existing = await Enrollment.findOne({ student: studentId, batch: batchId });
    if (existing) return res.status(400).json({ success: false, message: "Already enrolled in this batch" });

    const enrollment = await Enrollment.create({ student: studentId, batch: batchId, createdBy: studentId });
    await Batch.findByIdAndUpdate(batchId, { $inc: { enrolledCount: 1 } });

    // Auto-create invoice
    const invoice = await Invoice.create({
      enrollment: enrollment._id,
      totalAmount: batch.course?.fees || 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    res.status(201).json({ success: true, data: { enrollment, invoice }, message: "Enrolled successfully! Invoice created." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/student/pay — student submits UPI payment
export const submitPayment = async (req, res) => {
  try {
    const { invoiceId, amount, transactionId, paymentMode } = req.body;
    // paymentMode: "FULL" | "PARTIAL"

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    const enrollment = await Enrollment.findById(invoice.enrollment);
    if (!enrollment || enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized for this invoice" });
    }

    const payAmount = paymentMode === "FULL" ? (invoice.totalAmount - invoice.amountPaid) : Number(amount);

    if (payAmount <= 0) return res.status(400).json({ success: false, message: "Amount must be greater than 0" });
    if (invoice.amountPaid + payAmount > invoice.totalAmount) {
      return res.status(400).json({ success: false, message: "Amount exceeds remaining balance" });
    }

    // Create payment with PENDING approval status
    const payment = await Payment.create({
      invoice: invoiceId,
      amount: payAmount,
      paymentMethod: "UPI",
      transactionId,
      approvalStatus: "PENDING",
    });

    // Update invoice amount
    invoice.amountPaid += payAmount;
    invoice.status = invoice.amountPaid >= invoice.totalAmount ? "PAID" : "PARTIAL";
    await invoice.save();

    // Notify counselors/admin about new payment
    const counselors = await User.find({ role: { $in: [ROLES.COUNSELOR, ROLES.ADMIN] } });
    for (const c of counselors) {
      await Notification.create({
        recipient: c._id,
        title: "New Payment Submitted",
        message: `${req.user.name} submitted ₹${payAmount} payment. Awaiting approval.`,
        type: "PAYMENT",
        relatedEntity: payment._id,
      });
    }

    res.status(201).json({ success: true, data: payment, message: "Payment submitted! Awaiting approval." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/student/payments
export const getStudentPayments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id });
    const enrollmentIds = enrollments.map(e => e._id);
    const invoices = await Invoice.find({ enrollment: { $in: enrollmentIds } })
      .populate({ path: "enrollment", populate: { path: "batch", populate: { path: "course", select: "title" } } });
    const invoiceIds = invoices.map(i => i._id);
    const payments = await Payment.find({ invoice: { $in: invoiceIds } }).populate("invoice").sort("-paidAt");
    res.status(200).json({ success: true, data: { invoices, payments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/student/certificates
export const getStudentCertificates = async (req, res) => {
  try {
    const completedEnrollments = await Enrollment.find({ student: req.user._id, status: "COMPLETED" })
      .populate({ path: "batch", populate: { path: "course", select: "title durationInMonths" } });
    res.status(200).json({ success: true, data: completedEnrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/student/notifications
export const getStudentNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort("-createdAt").limit(20);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/student/notifications/:id/read
export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH /api/student/notifications/read-all
export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};