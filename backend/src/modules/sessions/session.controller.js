import Session from "./session.model.js";
import Batch from "../batches/batch.model.js";
import Notification from "../notifications/notification.model.js";
import mongoose from "mongoose";

// POST /api/sessions
export const createSession = async (req, res) => {
  try {
    const { batchId, trainerId, title, description, sessionDate, startTime, endTime, meetingLink, isRecurring } = req.body;

    const batch = await Batch.findById(batchId).populate("course", "title");
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

    // Resolve trainer: use provided trainerId, else batch's first trainer
    const resolvedTrainerId = trainerId || batch.trainers?.[0] || batch.trainer;

    const userId = req.user._id || req.user.id;
    const sessionDoc = {
      batch: batchId,
      trainer: resolvedTrainerId,
      title,
      description,
      sessionDate,
      startTime,
      endTime,
      meetingLink,
      isRecurring: isRecurring || false,
      dayOfWeek: sessionDate
        ? new Date(sessionDate).toLocaleDateString("en-US", { weekday: "long" })
        : "",
    };

    if (userId && userId !== "admin-env" && mongoose.Types.ObjectId.isValid(userId)) {
      sessionDoc.createdBy = userId;
    }

    const session = await Session.create(sessionDoc);
    const populated = await Session.findById(session._id)
      .populate("batch", "name")
      .populate("trainer", "name email");

    // Notify the assigned trainer
    if (resolvedTrainerId) {
      await Notification.create({
        recipient: resolvedTrainerId,
        title: "New Session Assigned",
        message: `Session "${title}" scheduled on ${new Date(sessionDate).toDateString()} at ${startTime}${meetingLink ? ` — Meet: ${meetingLink}` : ""}`,
        type: "SESSION",
        relatedEntity: session._id,
        relatedModel: "Session",
      });
    }

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
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/sessions/trainer — trainer's sessions via batch OR direct trainer field
export const getMyTrainerSessions = async (req, res) => {
  try {
    const trainerId = req.user._id || req.user.id;

    // Multi-trainer support: find batches where trainer is in trainers array
    const trainerBatches = await Batch.find({
      $or: [{ trainers: trainerId }, { trainer: trainerId }],
    });
    const batchIds = trainerBatches.map(b => b._id);

    const sessions = await Session.find({
      $or: [{ trainer: trainerId }, { batch: { $in: batchIds } }],
    })
      .populate("batch", "name _id")
      .populate("trainer", "name email")
      .sort("sessionDate startTime");

    res.json({ success: true, data: sessions });
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
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/sessions/:id
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    res.json({ success: true, message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/sessions/assign-trainer (legacy single-trainer compat)
export const assignTrainerToBatch = async (req, res) => {
  try {
    const { batchId, trainerId } = req.body;
    const batch = await Batch.findByIdAndUpdate(
      batchId,
      { trainer: trainerId, $addToSet: { trainers: trainerId } },
      { new: true }
    )
      .populate("trainers", "name email")
      .populate("course", "title");
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
    await Session.updateMany({ batch: batchId }, { trainer: trainerId });
    res.json({ success: true, data: batch, message: "Trainer assigned successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};