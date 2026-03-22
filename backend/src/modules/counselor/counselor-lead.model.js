import mongoose from "mongoose";

// Stores leads submitted via counselor's unique enrollment link
// Each record is strictly visible only to the counselor who owns the link

const counselorLeadSchema = new mongoose.Schema(
  {
    // Which counselor owns this lead
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Form fields submitted by the prospective student
    name:        { type: String, required: true, trim: true },
    fatherName:  { type: String, trim: true },
    address:     { type: String, trim: true },
    phone:       { type: String, required: true },
    email:       { type: String, lowercase: true, trim: true },

    // Counselor can convert this lead to a real student account
    convertedToStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "CONVERTED", "DROPPED"],
      default: "NEW",
    },

    notes: { type: String },
  },
  { timestamps: true }
);

const CounselorLead = mongoose.model("CounselorLead", counselorLeadSchema);
export default CounselorLead;