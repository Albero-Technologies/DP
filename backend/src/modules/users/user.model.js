import mongoose from "mongoose";
import { ROLES } from "../../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT },
    phone:    { type: String },
    isActive: { type: Boolean, default: true },

    // ── Student-specific fields ──────────────────────────────
    // Unique readable ID e.g. STU-0001
    studentId: { type: String, unique: true, sparse: true },

    // 3-state access control
    // INACTIVE  → not enrolled, no payment
    // TRIAL     → enrolled + initial payment done
    // ACTIVE    → full payment done
    accessStatus: {
      type: String,
      enum: ["INACTIVE", "TRIAL", "ACTIVE"],
      default: "INACTIVE",
    },

    // Counselor who enrolled this student
    assignedCounselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // From counselor enrollment form
    fatherName: { type: String, trim: true },
    address:    { type: String, trim: true },
  },
  { timestamps: true }
);

// Auto-generate studentId — async style for Mongoose 7+
userSchema.pre("save", async function () {
  if (this.isNew && this.role === ROLES.STUDENT && !this.studentId) {
    const count = await mongoose.model("User").countDocuments({ role: ROLES.STUDENT });
    this.studentId = `STU-${String(count + 1).padStart(4, "0")}`;
  }
});

const User = mongoose.model("User", userSchema);
export default User;