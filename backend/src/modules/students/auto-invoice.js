import Enrollment from "../enrollments/enrollment.model.js";
import Invoice    from "../finance/invoice.model.js";
import mongoose   from "mongoose";

// ── Fake enrollment ID for DEMO invoices (no real enrollment needed) ──
const DEMO_ENROLLMENT_PLACEHOLDER = new mongoose.Types.ObjectId("000000000000000000000001");

export const autoCreateInvoice = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseType, amount } = req.body || {};

    // ── DEMO course invoice (no enrollment needed) ──────────────
    if (courseType === "DEMO") {
      // Check if demo invoice already exists for this student
      let demoInvoice = await Invoice.findOne({
        "meta.studentId": studentId,
        "meta.type": "DEMO",
        status: { $ne: "PAID" },
      });

      if (!demoInvoice) {
        const demoAmount = amount || 999; // fallback amount
        demoInvoice = await Invoice.create({
          enrollment:  DEMO_ENROLLMENT_PLACEHOLDER,
          totalAmount: demoAmount,
          amountPaid:  0,
          status:      "DUE",
          dueDate:     new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          meta: { studentId, type: "DEMO" },
        });
      }

      return res.status(200).json({
        success:    true,
        data:       { invoices: [demoInvoice], dueInvoice: demoInvoice },
      });
    }

    // ── BATCH course invoice (enrollment based) ─────────────────
    const enrollments = await Enrollment.find({ student: studentId })
      .populate({ path: "batch", populate: { path: "course", select: "title fees" } });

    const invoices = [];

    for (const enr of enrollments) {
      let invoice = await Invoice.findOne({ enrollment: enr._id });
      if (!invoice) {
        const fees = enr.batch?.course?.fees;
        if (!fees || fees <= 0) continue;
        invoice = await Invoice.create({
          enrollment:  enr._id,
          totalAmount: fees,
          amountPaid:  0,
          status:      "DUE",
          dueDate:     new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        // Re-fetch populated
        invoice = await Invoice.findById(invoice._id)
          .populate({ path: "enrollment", populate: { path: "batch", populate: { path: "course", select: "title fees" } } });
      }
      invoices.push(invoice);
    }

    const dueInvoice = invoices.find(inv => (inv.totalAmount - inv.amountPaid) > 0);

    res.status(200).json({
      success: true,
      data:    { invoices, dueInvoice },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};