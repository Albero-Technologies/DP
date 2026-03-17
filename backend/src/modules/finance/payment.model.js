import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["CASH", "UPI", "BANK_TRANSFER", "CARD"], required: true },
    transactionId: { type: String },
    paidAt: { type: Date, default: Date.now },
    // Approval workflow
    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Receipt upload (URL or base64 reference)
    receiptUrl: { type: String },
    reminderSent: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
