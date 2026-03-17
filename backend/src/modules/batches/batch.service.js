import mongoose from "mongoose";
import Batch from "./batch.model.js";
import Course from "../courses/course.model.js";
import User from "../users/user.model.js";
import { ROLES } from "../../config/constants.js";

export const createBatch = async (batchData, adminId) => {
  const {
    name,
    course,
    trainer,
    startDate,
    endDate,
    capacity,
  } = batchData;

  // Validate course exists
  const existingCourse = await Course.findById(course);
  if (!existingCourse) {
    throw new Error("Course not found");
  }

  // Validate trainer (if provided)
  if (trainer) {
    const trainerUser = await User.findById(trainer);

    if (!trainerUser) {
      throw new Error("Trainer not found");
    }

    if (trainerUser.role !== ROLES.TRAINER) {
      throw new Error("Assigned user is not a trainer");
    }
  }

  // Validate dates
  if (new Date(startDate) >= new Date(endDate)) {
    throw new Error("End date must be after start date");
  }

  // Create batch
  const batch = await Batch.create({
    name,
    course,
    trainer,
    startDate,
    endDate,
    capacity,
    ...(adminId && adminId !== "admin-env" && mongoose.Types.ObjectId.isValid(adminId) ? { createdBy: adminId } : {}),
  });

  return batch;
};

export const getAllBatches = async () => {
  return await Batch.find()
    .populate("course", "title durationInMonths fees")
    .populate("trainer", "name email role")
    .populate("createdBy", "name email");
};

export const getBatchById = async (id) => {
  const batch = await Batch.findById(id)
    .populate("course")
    .populate("trainer", "name email role")
    .populate("createdBy", "name email");

  if (!batch) {
    throw new Error("Batch not found");
  }

  return batch;
};

export const updateBatch = async (id, updateData) => {
  const {
    name,
    course,
    trainer,
    startDate,
    endDate,
    capacity,
  } = updateData;

  // Check if batch exists
  const batch = await Batch.findById(id);
  if (!batch) {
    throw new Error("Batch not found");
  }

  // Validate course exists (if provided)
  if (course) {
    const existingCourse = await Course.findById(course);
    if (!existingCourse) {
      throw new Error("Course not found");
    }
  }

  // Validate trainer (if provided)
  if (trainer) {
    const trainerUser = await User.findById(trainer);

    if (!trainerUser) {
      throw new Error("Trainer not found");
    }

    if (trainerUser.role !== ROLES.TRAINER) {
      throw new Error("Assigned user is not a trainer");
    }
  }

  // Validate dates (if provided)
  const updatedStartDate = startDate || batch.startDate;
  const updatedEndDate = endDate || batch.endDate;
  
  if (new Date(updatedStartDate) >= new Date(updatedEndDate)) {
    throw new Error("End date must be after start date");
  }

  // Update batch
  const updatedBatch = await Batch.findByIdAndUpdate(
    id,
    {
      name: name || batch.name,
      course: course || batch.course,
      trainer: trainer || batch.trainer,
      startDate: updatedStartDate,
      endDate: updatedEndDate,
      capacity: capacity || batch.capacity,
    },
    { new: true, runValidators: true }
  )
    .populate("course", "title durationInMonths fees")
    .populate("trainer", "name email role")
    .populate("createdBy", "name email");

  return updatedBatch;
};

export const deleteBatch = async (id) => {
  const batch = await Batch.findById(id);

  if (!batch) {
    throw new Error("Batch not found");
  }

  await Batch.findByIdAndDelete(id);
  return batch;
};