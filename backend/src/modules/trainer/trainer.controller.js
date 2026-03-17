import Batch from "../batches/batch.model.js";
import Enrollment from "../enrollments/enrollment.model.js";

// GET /api/trainer/batches
export const getTrainerBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ trainer: req.user._id })
      .populate("course", "title description youtubeLink fees durationInMonths")
      .sort("-createdAt");
    res.status(200).json({ success: true, data: batches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/trainer/students
export const getTrainerStudents = async (req, res) => {
  try {
    const batches = await Batch.find({ trainer: req.user._id });
    const batchIds = batches.map((b) => b._id);
    const enrollments = await Enrollment.find({ batch: { $in: batchIds } })
      .populate("student", "name email phone")
      .populate("batch", "name");
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
