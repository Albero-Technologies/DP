import User from "../users/user.model.js";
import Invoice from "../finance/invoice.model.js";
import Payment from "../finance/payment.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import { ROLES } from "../../config/constants.js";
import bcrypt from "bcryptjs";

// ─── Counselor Management ────────────────────────────────────────────────────

export const createCounselor = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already in use" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: ROLES.COUNSELOR, phone });
    res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCounselors = async (req, res) => {
  try {
    const counselors = await User.find({ role: ROLES.COUNSELOR }).select("-password").sort("-createdAt");
    res.status(200).json({ success: true, data: counselors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCounselor = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (password) rest.password = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: ROLES.COUNSELOR }, rest, { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Counselor not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCounselor = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: ROLES.COUNSELOR });
    if (!user) return res.status(404).json({ success: false, message: "Counselor not found" });
    res.status(200).json({ success: true, message: "Counselor deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Trainer Management ──────────────────────────────────────────────────────

export const createTrainer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already in use" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: ROLES.TRAINER, phone });
    res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: ROLES.TRAINER }).select("-password").sort("-createdAt");
    res.status(200).json({ success: true, data: trainers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTrainer = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (password) rest.password = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: ROLES.TRAINER }, rest, { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Trainer not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTrainer = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: ROLES.TRAINER });
    if (!user) return res.status(404).json({ success: false, message: "Trainer not found" });
    res.status(200).json({ success: true, message: "Trainer deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Payment History ──────────────────────────────────────────────────────────

export const getAllPayments = async (req, res) => {
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

export const getPaymentsByStudent = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.studentId });
    const enrollmentIds = enrollments.map(e => e._id);
    const invoices = await Invoice.find({ enrollment: { $in: enrollmentIds } });
    const invoiceIds = invoices.map(i => i._id);
    const payments = await Payment.find({ invoice: { $in: invoiceIds } })
      .populate("invoice").sort("-createdAt");
    res.status(200).json({ success: true, data: { invoices, payments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ FIX: skip approvedBy if user is env admin (id = "admin-env", not a valid ObjectId)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updateData = { approvalStatus: status };

    // Only set approvedBy if it's a real MongoDB ObjectId (not env admin)
    const userId = req.user._id || req.user.id;
    if (userId && userId !== "admin-env") {
      updateData.approvedBy = userId;
    }

    const payment = await Payment.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Assign Trainer to Batch ──────────────────────────────────────────────────

export const assignTrainer = async (req, res) => {
  try {
    const { trainerId, batchId } = req.body;
    const Batch = (await import("../batches/batch.model.js")).default;
    const batch = await Batch.findByIdAndUpdate(batchId, { trainer: trainerId }, { new: true })
      .populate("trainer", "name email");
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
    res.status(200).json({ success: true, data: batch });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};