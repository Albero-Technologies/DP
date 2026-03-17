import mongoose from "mongoose";

const demoCourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    youtubeLink: { type: String, trim: true, required: true },
    thumbnail: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const DemoCourse = mongoose.model("DemoCourse", demoCourseSchema);
export default DemoCourse;
