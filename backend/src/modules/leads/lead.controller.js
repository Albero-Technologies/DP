import Lead from "./lead.model.js";
import User from "../users/user.model.js";
import Batch from "../batches/batch.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import Payment from "../finance/payment.model.js";
import Invoice from "../finance/invoice.model.js";
import Notification from "../notifications/notification.model.js";
import { ROLES } from "../../config/constants.js";
import bcrypt from "bcryptjs";

// ─── Student CRUD (replaces Leads) ──────────────────────────────────────────

export const createStudent = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already in use" });
    const hashed = await bcrypt.hash(password || "student123", 10);
    const user = await User.create({ name, email, password: hashed, role: ROLES.STUDENT, phone });
    res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: ROLES.STUDENT }).select("-password").sort("-createdAt");
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { password, role, ...rest } = req.body;
    if (password) rest.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Assign Trainer to Batch ─────────────────────────────────────────────────

export const assignTrainerToBatch = async (req, res) => {
  try {
    const { trainerId, batchId } = req.body;
    const batch = await Batch.findByIdAndUpdate(batchId, { trainer: trainerId }, { new: true })
      .populate("trainer", "name email");
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
    res.status(200).json({ success: true, data: batch });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Enroll Student to Batch ─────────────────────────────────────────────────

export const enrollStudentToBatch = async (req, res) => {
  try {
    const { studentId, batchId } = req.body;
    const existing = await Enrollment.findOne({ student: studentId, batch: batchId });
    if (existing) return res.status(400).json({ success: false, message: "Student already enrolled in this batch" });
    const enrollment = await Enrollment.create({ student: studentId, batch: batchId, createdBy: req.user._id });
    await Batch.findByIdAndUpdate(batchId, { $inc: { enrolledCount: 1 } });
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Follow-ups ───────────────────────────────────────────────────────────────

export const createFollowUp = async (req, res) => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getFollowUps = async (req, res) => {
  try {
    const followups = await Lead.find({ followUpDate: { $exists: true, $ne: null } })
      .populate("studentId", "name email phone")
      .sort("followUpDate");
    res.status(200).json({ success: true, data: followups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFollowUp = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ success: false, message: "Follow-up not found" });
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Payment Reminder ─────────────────────────────────────────────────────────

export const sendPaymentReminder = async (req, res) => {
  try {
    const { studentId, message } = req.body;
    const notif = await Notification.create({
      recipient: studentId,
      title: "Payment Reminder",
      message: message || "Please complete your pending payment at the earliest.",
      type: "PAYMENT",
    });
    res.status(200).json({ success: true, message: "Reminder sent", data: notif });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Payment Status (Counselor Approves/Rejects) ──────────────────────────────

export const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ approvalStatus: "PENDING" })
      .populate({
        path: "invoice",
        populate: {
          path: "enrollment",
          populate: [
            { path: "student", select: "name email" },
            { path: "batch", populate: { path: "course", select: "title" } },
          ],
        },
      })
      .sort("-createdAt");
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePaymentApproval = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["APPROVED","REJECTED","PENDING"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const uid = req.user._id || req.user.id;
    const updateData = { approvalStatus: status };
    if (uid && uid !== "admin-env") updateData.approvedBy = uid;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate({ path: "invoice", populate: { path: "enrollment", populate: { path: "student", select: "name email" } } });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    // Notify the student
    if (payment.invoice?.enrollment?.student) {
      await Notification.create({
        recipient: payment.invoice.enrollment.student._id,
        title: `Payment ${status}`,
        message: `Your payment of ₹${payment.amount} has been ${status.toLowerCase()}.`,
        type: "PAYMENT",
      });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Get students with enrollment status ─────────────────────────────────────

export const getStudentsWithEnrollment = async (req, res) => {
  try {
    const students = await User.find({ role: ROLES.STUDENT }).select("-password").sort("-createdAt");
    const enrollments = await Enrollment.find()
      .populate({ path: "batch", populate: { path: "course", select: "title" } });

    // Map enrollments by studentId
    const enrollmentMap = {};
    enrollments.forEach(e => {
      const sid = e.student?.toString();
      if (!enrollmentMap[sid]) enrollmentMap[sid] = [];
      enrollmentMap[sid].push(e);
    });

    const result = students.map(s => ({
      ...s.toObject(),
      enrollments: enrollmentMap[s._id.toString()] || [],
      isEnrolled: !!(enrollmentMap[s._id.toString()]?.length),
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get ALL payments (not just pending) ─────────────────────────────────────

export const getAllPaymentsForCounselor = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "invoice",
        populate: {
          path: "enrollment",
          populate: [
            { path: "student", select: "name email phone" },
            { path: "batch", populate: { path: "course", select: "title" } },
          ],
        },
      })
      .sort("-createdAt");
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};