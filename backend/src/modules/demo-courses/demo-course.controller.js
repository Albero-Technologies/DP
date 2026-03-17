import DemoCourse from "./demo-course.model.js";

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
    const course = await DemoCourse.create({ ...req.body, createdBy: req.user?._id });
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
