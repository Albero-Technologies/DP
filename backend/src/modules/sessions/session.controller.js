import Session from "./session.model.js";
import Batch from "../batches/batch.model.js";
import mongoose from "mongoose";

// POST /api/sessions
export const createSession = async (req, res) => {
  try {
    const { batchId, trainerId, title, description, sessionDate, startTime, endTime, meetingLink, isRecurring } = req.body;

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

    // Assign trainer to batch if provided
    const resolvedTrainerId = trainerId || batch.trainer;
    if (trainerId) {
      await Batch.findByIdAndUpdate(batchId, { trainer: trainerId });
    }

    const userId = req.user._id || req.user.id;
    const sessionDoc = {
      batch: batchId,
      trainer: resolvedTrainerId,   // always store trainer on session
      title,
      description,
      sessionDate,
      startTime,
      endTime,
      meetingLink,
      isRecurring: isRecurring || false,
      dayOfWeek: sessionDate ? new Date(sessionDate).toLocaleDateString("en-US", { weekday: "long" }) : "",
    };

    if (userId && userId !== "admin-env" && mongoose.Types.ObjectId.isValid(userId)) {
      sessionDoc.createdBy = userId;
    }

    const session = await Session.create(sessionDoc);
    const populated = await Session.findById(session._id)
      .populate("batch", "name")
      .populate("trainer", "name email");

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/sessions?batchId=xxx
export const getSessionsByBatch = async (req, res) => {
  try {
    const { batchId } = req.query;
    const filter = batchId ? { batch: batchId } : {};
    const sessions = await Session.find(filter)
      .populate("batch", "name course")
      .populate("trainer", "name email")
      .sort("sessionDate startTime");
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/sessions/trainer — find sessions by trainer's assigned batches (not just trainer field)
export const getMyTrainerSessions = async (req, res) => {
  try {
    const trainerId = req.user._id || req.user.id;

    // Find all batches assigned to this trainer
    const trainerBatches = await Batch.find({ trainer: trainerId });
    const batchIds = trainerBatches.map(b => b._id);

    // Find sessions by trainer field OR by batch assigned to trainer
    const sessions = await Session.find({
      $or: [
        { trainer: trainerId },
        { batch: { $in: batchIds } },
      ],
    })
      .populate("batch", "name _id")
      .populate("trainer", "name email")
      .sort("sessionDate startTime");

    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/sessions/:id
export const updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("batch", "name")
      .populate("trainer", "name email");
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/sessions/:id
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    res.status(200).json({ success: true, message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/sessions/assign-trainer
export const assignTrainerToBatch = async (req, res) => {
  try {
    const { batchId, trainerId } = req.body;
    const batch = await Batch.findByIdAndUpdate(batchId, { trainer: trainerId }, { new: true })
      .populate("trainer", "name email")
      .populate("course", "title");
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

    // Also update trainer field on all existing sessions for this batch
    await Session.updateMany({ batch: batchId }, { trainer: trainerId });

    res.status(200).json({ success: true, data: batch, message: "Trainer assigned successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};