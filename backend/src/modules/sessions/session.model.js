import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String, trim: true },
    sessionDate: { type: Date, required: true },
    startTime: { type: String, required: true },  // "10:00"
    endTime:   { type: String, required: true },  // "11:30"
    dayOfWeek: { type: String },                  // "Monday" — for recurring display
    meetingLink: { type: String, trim: true },    // optional zoom/meet link
    isRecurring: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;