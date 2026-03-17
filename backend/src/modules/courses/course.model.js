import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title:            { type: String, required: true, trim: true },
    description:      { type: String, trim: true },
    durationInMonths: { type: Number, required: true },
    fees:             { type: Number, required: true },
    youtubeLink:      { type: String, trim: true },
    isActive:         { type: Boolean, default: true },
    // Optional — env admin has no ObjectId
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;