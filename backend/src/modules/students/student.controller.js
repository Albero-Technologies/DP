import User from "../users/user.model.js";
import CounselorLead from "../counselor/counselor-lead.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import Invoice from "../finance/invoice.model.js";
import Payment from "../finance/payment.model.js";
import Batch from "../batches/batch.model.js";
import Notification from "../notifications/notification.model.js";
import { ROLES } from "../../config/constants.js";

// ── ADMIN ────────────────────────────────────────────────────

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: ROLES.STUDENT })
      .select("-password")
      .populate("assignedCounselor", "name email")
      .sort("-createdAt");
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentsByCounselor = async (req, res) => {
  try {
    // Step 1: All counselors
    const counselors = await User.find({ role: ROLES.COUNSELOR })
      .select("name email phone").sort("name");

    // Step 2: All students
    const students = await User.find({ role: ROLES.STUDENT })
      .select("-password")
      .populate("assignedCounselor", "name email")
      .sort("-createdAt");

    // Step 3: Build leadMap from CounselorLead (convertedToStudent -> counselor)
    const leadMap = {};
    const convertedLeads = await CounselorLead.find({
      convertedToStudent: { $ne: null },
    }).select("counselor convertedToStudent").lean();

    convertedLeads.forEach(l => {
      if (l.convertedToStudent && l.counselor) {
        leadMap[String(l.convertedToStudent)] = String(l.counselor);
      }
    });

    // Step 4: Group students under counselors
    const grouped = counselors.map(counselor => {
      const cId = String(counselor._id);
      const counselorStudents = students.filter(s => {
        const sId = String(s._id);
        // Primary: assignedCounselor field on User
        if (s.assignedCounselor) {
          const acId = String(s.assignedCounselor._id || s.assignedCounselor);
          if (acId === cId) return true;
        }
        // Fallback: CounselorLead conversion record
        if (leadMap[sId] === cId) return true;
        return false;
      });

      return {
        counselor: {
          _id:   counselor._id,
          name:  counselor.name,
          email: counselor.email,
          phone: counselor.phone,
        },
        students:     counselorStudents,
        studentCount: counselorStudents.length,
      };
    });

    // Step 5: Unassigned students
    const assignedIds = new Set([
      ...Object.keys(leadMap),
      ...students.filter(s => s.assignedCounselor).map(s => String(s._id)),
    ]);
    const unassigned = students.filter(s => !assignedIds.has(String(s._id)));

    res.status(200).json({
      success: true,
      data: {
        grouped,
        unassigned,
        totalStudents:   students.length,
        totalCounselors: counselors.length,
      },
    });
  } catch (error) {
    console.error("getStudentsByCounselor error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select("-password").populate("assignedCounselor", "name email");
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { password, role, ...updateData } = req.body;
    // Allow password update if provided
    if (password) {
      const bcrypt = (await import("bcryptjs")).default;
      updateData.password = await bcrypt.hash(password, 10);
    }
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

// ── STUDENT PORTAL ───────────────────────────────────────────

export const getStudentCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({ path: "batch", populate: [
        { path: "course", select: "title description durationInMonths fees youtubeLink videos" },
        { path: "trainer", select: "name email" },
      ]});
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAvailableBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ isActive: true })
      .populate("course", "title description fees durationInMonths")
      .populate("trainer", "name email")
      .sort("-createdAt");
    const enrollments = await Enrollment.find({ student: req.user._id });
    const enrolledBatchIds = new Set(enrollments.map(e => e.batch.toString()));
    const result = batches.map(b => ({ ...b.toObject(), isEnrolled: enrolledBatchIds.has(b._id.toString()) }));
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const selfEnroll = async (req, res) => {
  try {
    const { batchId } = req.body;
    const batch = await Batch.findById(batchId).populate("course");
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
    const existing = await Enrollment.findOne({ student: req.user._id, batch: batchId });
    if (existing) return res.status(400).json({ success: false, message: "Already enrolled in this batch" });
    const enrollment = await Enrollment.create({ student: req.user._id, batch: batchId, createdBy: req.user._id });
    await Batch.findByIdAndUpdate(batchId, { $inc: { enrolledCount: 1 } });
    const invoice = await Invoice.create({
      enrollment: enrollment._id,
      totalAmount: batch.course?.fees || 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    res.status(201).json({ success: true, data: { enrollment, invoice }, message: "Enrolled successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const submitPayment = async (req, res) => {
  try {
    const { invoiceId, amount, transactionId, paymentMode } = req.body;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    const enrollment = await Enrollment.findById(invoice.enrollment);
    if (!enrollment || enrollment.student.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });
    const payAmount = paymentMode === "FULL" ? (invoice.totalAmount - invoice.amountPaid) : Number(amount);
    if (payAmount <= 0) return res.status(400).json({ success: false, message: "Amount must be > 0" });
    if (invoice.amountPaid + payAmount > invoice.totalAmount)
      return res.status(400).json({ success: false, message: "Exceeds remaining balance" });
    const payment = await Payment.create({
      invoice: invoiceId, amount: payAmount, paymentMethod: "UPI",
      transactionId, approvalStatus: "PENDING", createdBy: req.user._id,
    });
    invoice.amountPaid += payAmount;
    invoice.status = invoice.amountPaid >= invoice.totalAmount ? "PAID" : "PARTIAL";
    await invoice.save();
    const staff = await User.find({ role: { $in: [ROLES.COUNSELOR, ROLES.ADMIN] } });
    await Notification.insertMany(staff.map(c => ({
      recipient: c._id, title: "New Payment Submitted",
      message: `${req.user.name} submitted payment of Rs.${payAmount}. Awaiting approval.`,
      type: "PAYMENT", relatedEntity: payment._id, relatedModel: "Payment",
    })));
    res.status(201).json({ success: true, data: payment, message: "Payment submitted! Awaiting approval." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStudentPayments = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get enrollment-based invoices
    const enrollments = await Enrollment.find({ student: studentId });
    const enrollmentInvoices = await Invoice.find({ enrollment: { $in: enrollments.map(e => e._id) } })
      .populate({ path: "enrollment", populate: { path: "batch", populate: { path: "course", select: "title" } } });

    // Get DEMO invoices (no enrollment, linked via meta.studentId)
    const demoInvoices = await Invoice.find({ "meta.studentId": studentId });

    // Merge both
    const allInvoices = [...enrollmentInvoices, ...demoInvoices];
    const allInvoiceIds = allInvoices.map(i => i._id);

    // Get all payments for these invoices
    const payments = await Payment.find({ invoice: { $in: allInvoiceIds } })
      .populate("invoice").sort("-paidAt");

    res.status(200).json({ success: true, data: { invoices: allInvoices, payments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentCertificates = async (req, res) => {
  try {
    const completedEnrollments = await Enrollment.find({ student: req.user._id, status: "COMPLETED" })
      .populate({ path: "batch", populate: { path: "course", select: "title durationInMonths" } });
    res.status(200).json({ success: true, data: completedEnrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort("-createdAt").limit(20);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};