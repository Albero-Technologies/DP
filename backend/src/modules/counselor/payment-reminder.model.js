import mongoose from "mongoose";

const paymentReminderSchema = new mongoose.Schema(
  {
    sentBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    message: { type: String, required: true },
    amount:  { type: Number, required: true },

    // DEMO = unlock demo courses, BATCH = main course batch
    courseType:   { type: String, enum: ["DEMO", "BATCH"], default: "BATCH" },
    enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment" },

    status: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" },
    paidAt:    { type: Date },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true }
);

const PaymentReminder = mongoose.model("PaymentReminder", paymentReminderSchema);
export default PaymentReminder;