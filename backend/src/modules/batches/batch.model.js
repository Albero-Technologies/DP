import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    // Multiple trainers support
    trainers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Single trainer — kept for backward compat with existing service/populate calls
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    startDate:     { type: Date, required: true },
    endDate:       { type: Date, required: true },
    capacity:      { type: Number, required: true },
    enrolledCount: { type: Number, default: 0 },
    isActive:      { type: Boolean, default: true },
    createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true }
);

// Keep trainer in sync with trainers[0] — async style for Mongoose 7+
batchSchema.pre("save", async function () {
  if (this.trainers && this.trainers.length > 0) {
    this.trainer = this.trainers[0];
  }
});

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;