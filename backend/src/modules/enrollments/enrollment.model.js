import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    batch:   { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },

    // Direct course ref (denormalized for quick queries)
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    // Which counselor enrolled this student
    counselor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "DROPPED"],
      default: "ACTIVE",
    },

    // Per-student discount for this enrollment (₹ amount)
    discountAmount: { type: Number, default: 0 },

    enrolledAt: { type: Date, default: Date.now },
    createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true }
);

// Prevent duplicate enrollment (student + batch)
enrollmentSchema.index({ student: 1, batch: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;