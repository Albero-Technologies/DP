import Batch from "../batches/batch.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import Session from "../sessions/session.model.js";

// GET /api/trainer/batches
export const getTrainerBatches = async (req, res) => {
  try {
    const trainerId = req.user._id;

    // Support both single trainer field AND trainers array
    const batches = await Batch.find({
      $or: [
        { trainer:  trainerId },
        { trainers: trainerId },
      ],
    })
      .populate("course", "title description youtubeLink videos fees durationInMonths")
      .populate("trainers", "name email")
      .populate("trainer",  "name email")
      .sort("-createdAt");

    res.status(200).json({ success: true, data: batches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/trainer/students
export const getTrainerStudents = async (req, res) => {
  try {
    const trainerId = req.user._id;
    const batches = await Batch.find({
      $or: [{ trainer: trainerId }, { trainers: trainerId }],
    });
    const batchIds = batches.map(b => b._id);
    const enrollments = await Enrollment.find({ batch: { $in: batchIds } })
      .populate("student", "name email phone studentId accessStatus")
      .populate("batch",   "name");
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};