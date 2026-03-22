import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  url:      { type: String, required: true, trim: true },  // YouTube link
  order:    { type: Number, default: 0 },                  // display order
  addedAt:  { type: Date, default: Date.now },
});

const courseSchema = new mongoose.Schema(
  {
    title:            { type: String, required: true, trim: true },
    description:      { type: String, trim: true },
    durationInMonths: { type: Number, required: true },
    fees:             { type: Number, required: true },

    // Multiple videos support
    videos: [videoSchema],

    // Keep old field for backward compat
    youtubeLink: { type: String, trim: true },

    thumbnail: { type: String, trim: true },
    isActive:  { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;