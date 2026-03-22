import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title:   { type: String, required: true, trim: true },
  url:     { type: String, required: true, trim: true },
  order:   { type: Number, default: 0 },
  addedAt: { type: Date, default: Date.now },
});

const demoCourseSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    thumbnail:   { type: String, trim: true },
    isActive:    { type: Boolean, default: true },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Multiple videos
    videos: [videoSchema],

    // Keep old field for backward compat
    youtubeLink: { type: String, trim: true },
  },
  { timestamps: true }
);

const DemoCourse = mongoose.model("DemoCourse", demoCourseSchema);
export default DemoCourse;