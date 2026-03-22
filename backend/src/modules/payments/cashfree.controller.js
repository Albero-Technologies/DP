import axios from "axios";
import crypto from "crypto";
import Invoice from "../finance/invoice.model.js";
import Payment from "../finance/payment.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import User from "../users/user.model.js";
import Notification from "../notifications/notification.model.js";
import PaymentReminder from "../counselor/payment-reminder.model.js";
import { ROLES } from "../../config/constants.js";

// Headers are computed at request time so dotenv is already loaded
const getCFConfig = () => {
  const env    = process.env.CASHFREE_ENV || "sandbox";
  const appId  = process.env.CASHFREE_APP_ID;
  const secret = process.env.CASHFREE_SECRET_KEY;
  const base   = env === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
  const headers = {
    "x-client-id":     appId,
    "x-client-secret": secret,
    "x-api-version":   "2023-08-01",
    "Content-Type":    "application/json",
  };
  return { base, headers, env };
};

// ── POST /api/payments/cashfree/create-order ─────────────────
export const createCashfreeOrder = async (req, res) => {
  try {
    const { invoiceId, amount, paymentMode } = req.body;
    const student = req.user;

    if (!invoiceId || !amount) {
      return res.status(400).json({ success: false, message: "invoiceId and amount are required" });
    }

    const invoice = await Invoice.findById(invoiceId)
      .populate({ path: "enrollment", populate: { path: "batch", populate: { path: "course", select: "title" } } });

    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    // Verify this invoice belongs to this student
    // DEMO invoices have no real enrollment — verify via meta.studentId
    const isDemoInvoice = invoice.meta?.type === "DEMO";
    if (isDemoInvoice) {
      if (String(invoice.meta.studentId) !== String(student._id)) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }
    } else {
      const enrollment = await Enrollment.findById(invoice.enrollment._id || invoice.enrollment);
      if (!enrollment || String(enrollment.student) !== String(student._id)) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }
    }

    const remaining = invoice.totalAmount - invoice.amountPaid;
    const payAmount = Number(amount);

    if (payAmount <= 0 || payAmount > remaining) {
      return res.status(400).json({ success: false, message: `Amount must be between ₹1 and ₹${remaining}` });
    }

    // Unique order ID
    const orderId = `DP_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    const orderPayload = {
      order_id:       orderId,
      order_amount:   payAmount,
      order_currency: "INR",
      order_note:     `${invoice.enrollment?.batch?.course?.title || "Course"} Fee`,
      customer_details: {
        customer_id:    String(student._id),
        customer_name:  student.name,
        customer_email: student.email,
        customer_phone: student.phone || "9999999999",
      },
      order_meta: {
        return_url:  `${process.env.FRONTEND_URL}/student/payments?order_id={order_id}&status={order_status}`,
        notify_url:  `${process.env.BACKEND_URL}/api/payments/cashfree/webhook`,
        payment_methods: paymentMode || "upi,cc,dc,nb,wallet",
      },
    };

    const { base: CF_BASE, headers: CF_HEADERS, env: CF_ENV2 } = getCFConfig();
    const cfRes = await axios.post(`${CF_BASE}/orders`, orderPayload, { headers: CF_HEADERS });
    const { payment_session_id, order_id } = cfRes.data;

    // Store pending payment record
    const payment = await Payment.create({
      invoice:         invoiceId,
      amount:          payAmount,
      paymentMethod:   "CASHFREE",
      transactionId:   orderId,
      approvalStatus:  "PENDING",
      cfOrderId:       order_id,
      cfSessionId:     payment_session_id,
      createdBy:       student._id,
    });

    res.status(200).json({
      success: true,
      data: {
        orderId:          order_id,
        paymentSessionId: payment_session_id,
        amount:           payAmount,
        paymentId:        payment._id,
        cashfreeEnv:      process.env.CASHFREE_ENV || "sandbox", // read at runtime
      },
    });
  } catch (error) {
    console.error("Cashfree create order error:", error?.response?.data || error.message);
    res.status(500).json({ success: false, message: error?.response?.data?.message || error.message });
  }
};

// ── POST /api/payments/cashfree/verify ───────────────────────
export const verifyCashfreePayment = async (req, res) => {
  try {
    const { orderId, invoiceId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: "orderId required" });

    // Fetch order status from Cashfree
    const { base: CF_BASE, headers: CF_HEADERS } = getCFConfig();
    const cfRes = await axios.get(`${CF_BASE}/orders/${orderId}`, { headers: CF_HEADERS });
    const order = cfRes.data;
    const cfStatus = order.order_status; // PAID | ACTIVE | EXPIRED | CANCELLED

    if (cfStatus !== "PAID") {
      return res.status(200).json({ success: false, message: `Payment status: ${cfStatus}`, status: cfStatus });
    }

    // Find our payment record
    const payment = await Payment.findOne({ cfOrderId: orderId });
    if (!payment) return res.status(404).json({ success: false, message: "Payment record not found" });

    if (payment.approvalStatus === "APPROVED") {
      return res.status(200).json({ success: true, message: "Already verified", data: payment });
    }

    // Auto-approve Cashfree payments
    payment.approvalStatus = "APPROVED";
    payment.transactionId  = order.cf_order_id || orderId;
    payment.paidAt         = new Date();
    await payment.save();

    // Update invoice
    const invoice = await Invoice.findById(payment.invoice);
    if (invoice) {
      invoice.amountPaid += payment.amount;
      invoice.status = invoice.amountPaid >= invoice.totalAmount ? "PAID" : "PARTIAL";
      await invoice.save();

        // Update student access status
      if (invoice.meta?.type === "DEMO") {
        // DEMO payment — unlock demo courses (TRIAL)
        await User.findByIdAndUpdate(invoice.meta.studentId, {
          accessStatus: "TRIAL",
        });
      } else {
        const enrollment = await Enrollment.findById(invoice.enrollment);
        if (enrollment) {
          const isFullyPaid = invoice.amountPaid >= invoice.totalAmount;
          await User.findByIdAndUpdate(enrollment.student, {
            accessStatus: isFullyPaid ? "ACTIVE" : "TRIAL",
          });
        }
      }
    }

    // Mark related PaymentReminder as PAID
    await PaymentReminder.updateMany(
      { student: invoice.meta?.studentId || (await Enrollment.findById(invoice.enrollment))?.student, status: "PENDING" },
      { status: "PAID", paidAt: new Date(), paymentId: payment._id }
    );

    // Notify admin + counselor
    const staff = await User.find({ role: { $in: [ROLES.ADMIN, ROLES.COUNSELOR] } });
    await Notification.insertMany(staff.map(s => ({
      recipient:    s._id,
      title:        "Payment Received",
      message:      `₹${payment.amount} received via Cashfree (Order: ${orderId})`,
      type:         "PAYMENT",
      relatedEntity: payment._id,
      relatedModel: "Payment",
    })));

    res.status(200).json({ success: true, data: payment, message: "Payment verified successfully!" });
  } catch (error) {
    console.error("Cashfree verify error:", error?.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/payments/cashfree/webhook ──────────────────────
export const cashfreeWebhook = async (req, res) => {
  try {
    // Verify webhook signature
    const signature  = req.headers["x-webhook-signature"];
    const timestamp  = req.headers["x-webhook-timestamp"];
    const rawBody    = req.rawBody;

    if (process.env.CASHFREE_WEBHOOK_SECRET && signature) {
      const signedPayload = timestamp + rawBody;
      const expectedSig   = crypto.createHmac("sha256", process.env.CASHFREE_WEBHOOK_SECRET)
        .update(signedPayload).digest("base64");
      if (expectedSig !== signature) {
        return res.status(401).json({ message: "Invalid webhook signature" });
      }
    }

    const event = req.body;
    const eventType = event.type;

    if (eventType === "PAYMENT_SUCCESS_WEBHOOK") {
      const orderId = event.data?.order?.order_id;
      if (orderId) {
        const payment = await Payment.findOne({ cfOrderId: orderId });
        if (payment && payment.approvalStatus !== "APPROVED") {
          payment.approvalStatus = "APPROVED";
          payment.paidAt = new Date();
          await payment.save();

          const invoice = await Invoice.findById(payment.invoice);
          if (invoice) {
            invoice.amountPaid += payment.amount;
            invoice.status = invoice.amountPaid >= invoice.totalAmount ? "PAID" : "PARTIAL";
            await invoice.save();

            const enrollment = await Enrollment.findById(invoice.enrollment);
            if (enrollment) {
              const isFullyPaid = invoice.amountPaid >= invoice.totalAmount;
              await User.findByIdAndUpdate(enrollment.student, {
                accessStatus: isFullyPaid ? "ACTIVE" : "TRIAL",
              });
            }
          }
        }
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/payments/cashfree/invoice/:invoiceId ────────────
export const getInvoiceForPayment = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId)
      .populate({ path: "enrollment", populate: { path: "batch", populate: { path: "course", select: "title fees" } } });
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};