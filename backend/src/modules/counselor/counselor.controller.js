import User from "../users/user.model.js";
import CounselorLead from "./counselor-lead.model.js";
import PaymentReminder from "./payment-reminder.model.js";
import Invoice from "../finance/invoice.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import Batch from "../batches/batch.model.js";
import Notification from "../notifications/notification.model.js";
import { ROLES } from "../../config/constants.js";
import bcrypt from "bcryptjs";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ENROLLMENT LINK
// GET /api/counselor/enroll-link  → returns this counselor's link
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const getEnrollLink = async (req, res) => {
  const link = `${process.env.FRONTEND_URL}/enroll/${req.user._id}`;
  res.json({ success: true, link });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PUBLIC ENROLLMENT FORM SUBMIT
// POST /api/counselor/enroll/:counselorId  (no auth — public page)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const submitEnrollForm = async (req, res) => {
  try {
    const { counselorId } = req.params;
    const { name, fatherName, address, phone, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and phone are required" });
    }

    // Verify counselor exists
    const counselor = await User.findOne({ _id: counselorId, role: ROLES.COUNSELOR });
    if (!counselor) {
      return res.status(404).json({ success: false, message: "Invalid enrollment link" });
    }

    const lead = await CounselorLead.create({
      counselor: counselorId,
      name, fatherName, address, phone, email,
    });

    res.status(201).json({
      success: true,
      message: "Your details have been submitted. We will contact you shortly.",
      data: { id: lead._id },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET MY LEADS (counselor only sees own leads)
// GET /api/counselor/leads
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const getMyLeads = async (req, res) => {
  try {
    const leads = await CounselorLead.find({ counselor: req.user._id })
      .sort("-createdAt");
    res.json({ success: true, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONVERT LEAD TO STUDENT ACCOUNT
// POST /api/counselor/leads/:leadId/convert
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const convertLeadToStudent = async (req, res) => {
  try {
    const lead = await CounselorLead.findOne({
      _id: req.params.leadId,
      counselor: req.user._id, // strict isolation
    });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    if (lead.convertedToStudent) {
      return res.status(400).json({ success: false, message: "Already converted" });
    }

    // Create student user
    const tempPassword = `DP@${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const hashed = await bcrypt.hash(tempPassword, 10);

    const student = await User.create({
      name: lead.name,
      email: lead.email || `${lead.phone}@noemail.dp`,
      password: hashed,
      phone: lead.phone,
      role: ROLES.STUDENT,
      fatherName: lead.fatherName,
      address: lead.address,
      assignedCounselor: req.user._id,
      accessStatus: "INACTIVE",
    });

    lead.convertedToStudent = student._id;
    lead.status = "CONVERTED";
    await lead.save();

    res.status(201).json({
      success: true,
      message: "Student account created",
      data: { student, tempPassword },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UPDATE LEAD STATUS
// PATCH /api/counselor/leads/:leadId
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const updateLead = async (req, res) => {
  try {
    const lead = await CounselorLead.findOneAndUpdate(
      { _id: req.params.leadId, counselor: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET MY STUDENTS (students assigned to this counselor)
// GET /api/counselor/students
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const getMyCounselorStudents = async (req, res) => {
  try {
    const students = await User.find({
      assignedCounselor: req.user._id,
      role: ROLES.STUDENT,
    })
      .select("-password")
      .sort("-createdAt");
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ASSIGN STUDENT TO BATCH(ES)
// POST /api/counselor/students/:studentId/assign-batches
// body: { batchIds: [...] }
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const assignBatchesToStudent = async (req, res) => {
  try {
    const { batchIds } = req.body;
    const { studentId } = req.params;

    if (!batchIds || !batchIds.length) {
      return res.status(400).json({ success: false, message: "batchIds required" });
    }

    // Verify student belongs to this counselor
    const student = await User.findOne({ _id: studentId, assignedCounselor: req.user._id });
    if (!student) return res.status(403).json({ success: false, message: "Not your student" });

    const results = [];
    for (const batchId of batchIds) {
      try {
        const batch = await Batch.findById(batchId).populate("course");
        if (!batch) continue;

        const enrollment = await Enrollment.findOneAndUpdate(
          { student: studentId, batch: batchId },
          {
            student: studentId,
            batch: batchId,
            course: batch.course._id,
            counselor: req.user._id,
            createdBy: req.user._id,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Increment batch enrolledCount
        await Batch.findByIdAndUpdate(batchId, { $inc: { enrolledCount: 1 } });

        // Auto-create invoice if not exists
        const existingInvoice = await Invoice.findOne({ enrollment: enrollment._id });
        if (!existingInvoice && batch.course?.fees > 0) {
          await Invoice.create({
            enrollment: enrollment._id,
            totalAmount: batch.course.fees,
            amountPaid: 0,
            status: "UNPAID",
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
        }

        // Notify student
        await Notification.create({
          recipient: studentId,
          title: "Batch Assigned",
          message: `You have been enrolled in batch: ${batch.name}`,
          type: "BATCH",
          relatedEntity: enrollment._id,
        });

        results.push({ batchId, status: "assigned" });
      } catch (e) {
        results.push({ batchId, status: "already enrolled" });
      }
    }

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REMOVE STUDENT FROM BATCH
// DELETE /api/counselor/students/:studentId/batches/:batchId
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const removeStudentFromBatch = async (req, res) => {
  try {
    const { studentId, batchId } = req.params;

    const student = await User.findOne({ _id: studentId, assignedCounselor: req.user._id });
    if (!student) return res.status(403).json({ success: false, message: "Not your student" });

    const enrollment = await Enrollment.findOneAndDelete({ student: studentId, batch: batchId });
    if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found" });

    await Batch.findByIdAndUpdate(batchId, { $inc: { enrolledCount: -1 } });

    res.json({ success: true, message: "Student removed from batch" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAYMENT REMINDERS
// POST /api/counselor/reminders
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const sendPaymentReminder = async (req, res) => {
  try {
    const { studentId, message, amount, courseType, enrollmentId } = req.body;
    // courseType: "DEMO" | "BATCH"
    // enrollmentId: enrollment _id (for batch type)

    const student = await User.findOne({ studentId, role: ROLES.STUDENT });
    if (!student) return res.status(404).json({ success: false, message: "Student not found with this ID" });

    // Auto-create or find invoice for this enrollment
    let invoiceId = null;
    if (courseType === "BATCH" && enrollmentId) {
      let invoice = await Invoice.findOne({ enrollment: enrollmentId });
      if (!invoice) {
        // Create new invoice
        const enrollment = await Enrollment.findById(enrollmentId)
          .populate({ path: "batch", populate: { path: "course", select: "fees title" } });
        if (enrollment) {
          invoice = await Invoice.create({
            enrollment: enrollmentId,
            totalAmount: amount || enrollment.batch?.course?.fees || 0,
            amountPaid: 0,
            status: "DUE",
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
        }
      } else if (amount && amount > invoice.totalAmount - invoice.amountPaid) {
        // Update due amount if counselor specified more
        invoice.totalAmount = invoice.amountPaid + Number(amount);
        await invoice.save();
      }
      invoiceId = invoice?._id;
    }

    const reminder = await PaymentReminder.create({
      sentBy: req.user._id,
      student: student._id,
      message,
      amount,
      courseType: courseType || "BATCH",
      enrollmentId: enrollmentId || null,
    });

    // Build notification message
    const typeLabel = courseType === "DEMO" ? "Demo Course" : "Course Batch";
    const notifMessage = `${message} — Amount due: ₹${amount} (${typeLabel})`;

    // Notify student — include invoiceId as relatedEntity if available
    await Notification.create({
      recipient: student._id,
      title: "Payment Reminder",
      message: notifMessage,
      type: "REMINDER",
      relatedEntity: invoiceId || reminder._id,
      relatedModel: invoiceId ? "Invoice" : "PaymentReminder",
    });

    res.status(201).json({ success: true, data: reminder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyReminders = async (req, res) => {
  try {
    const reminders = await PaymentReminder.find({ sentBy: req.user._id })
      .populate("student", "name email phone studentId")
      .sort("-createdAt");
    res.json({ success: true, data: reminders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateReminderStatus = async (req, res) => {
  try {
    const reminder = await PaymentReminder.findByIdAndUpdate(
      req.params.reminderId,
      { status: req.body.status, paidAt: req.body.status === "PAID" ? new Date() : undefined },
      { new: true }
    );
    if (!reminder) return res.status(404).json({ success: false, message: "Reminder not found" });
    res.json({ success: true, data: reminder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};