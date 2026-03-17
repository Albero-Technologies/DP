import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, trim: true },
    phone: { type: String },
    followUpDate: { type: Date },
    followUpTime: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "DONE", "CANCELLED"],
      default: "PENDING",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", followUpSchema);
export default Lead;
