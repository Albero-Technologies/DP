import DemoCourse from "./demo-course.model.js";
import mongoose from "mongoose";

// Helper: safely get createdBy — skip "admin-env" string
const getCreatedBy = (userId) => {
  if (!userId || userId === "admin-env") return undefined;
  if (!mongoose.Types.ObjectId.isValid(userId)) return undefined;
  return userId;
};

export const getAllDemoCourses = async (req, res) => {
  try {
    const courses = await DemoCourse.find({ isActive: true }).sort("-createdAt");
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDemoCourse = async (req, res) => {
  try {
    const createdBy = getCreatedBy(req.user?._id || req.user?.id);
    const courseData = { ...req.body };
    if (createdBy) courseData.createdBy = createdBy;

    const course = await DemoCourse.create(courseData);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDemoCourse = async (req, res) => {
  try {
    const course = await DemoCourse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ success: false, message: "Demo course not found" });
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDemoCourse = async (req, res) => {
  try {
    const course = await DemoCourse.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Demo course not found" });
    res.status(200).json({ success: true, message: "Demo course deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};