import mongoose from "mongoose";
import Invoice from "./invoice.model.js";
import Payment from "./payment.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import { createNotification } from "../notifications/notification.service.js";

export const createInvoice = async (data, createdById) => {
  const { enrollmentId, totalAmount, dueDate } = data;

  // 1️⃣ Validate enrollment exists
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  // 2️⃣ Prevent duplicate invoice
  const existingInvoice = await Invoice.findOne({
    enrollment: enrollmentId,
  });

  if (existingInvoice) {
    throw new Error("Invoice already exists for this enrollment");
  }

  // 3️⃣ Create invoice
  const invoice = await Invoice.create({
    enrollment: enrollmentId,
    totalAmount,
    dueDate,
    ...(createdById && createdById !== "admin-env" && mongoose.Types.ObjectId.isValid(createdById) ? { createdBy: createdById } : {}),
  });

  // 4️⃣ Notify Student
  await createNotification({
    recipient: enrollment.student,
    title: "New Invoice Generated",
    message: "A new invoice has been created for your enrollment.",
    type: "INVOICE",
    relatedEntity: invoice._id,
  });

  return invoice;
};

export const addPayment = async (data, createdById) => {
  const { invoiceId, amount, paymentMethod, transactionId } = data;

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    throw new Error("Invoice not found");
  }

  // 1️⃣ Prevent overpayment
  if (invoice.amountPaid + amount > invoice.totalAmount) {
    throw new Error("Payment exceeds total invoice amount");
  }

  // 2️⃣ Create payment
  const payment = await Payment.create({
    invoice: invoiceId,
    amount,
    paymentMethod,
    transactionId,
    ...(createdById && createdById !== "admin-env" && mongoose.Types.ObjectId.isValid(createdById) ? { createdBy: createdById } : {}),
  });

  // 3️⃣ Update invoice amounts
  invoice.amountPaid += amount;

  if (invoice.amountPaid === invoice.totalAmount) {
    invoice.status = "PAID";
  } else if (invoice.amountPaid > 0) {
    invoice.status = "PARTIAL";
  }

  await invoice.save();

  // 4️⃣ Notify Student
  const enrollment = await Enrollment.findById(invoice.enrollment);

  await createNotification({
    recipient: enrollment.student,
    title: "Payment Received",
    message: `Your payment of ₹${amount} has been received.`,
    type: "PAYMENT",
    relatedEntity: payment._id,
  });

  return payment;
};

export const getInvoiceByEnrollment = async (enrollmentId) => {
  const invoice = await Invoice.findOne({
    enrollment: enrollmentId,
  }).populate({
    path: "enrollment",
    populate: [
      { path: "student", select: "name email" },
      {
        path: "batch",
        populate: { path: "course", select: "title" },
      },
    ],
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return invoice;
};

export const getPaymentsByInvoice = async (invoiceId) => {
  return await Payment.find({ invoice: invoiceId });
};