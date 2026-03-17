import mongoose from "mongoose";
import Enrollment from "./enrollment.model.js";
import Batch from "../batches/batch.model.js";
import User from "../users/user.model.js";
import { ROLES } from "../../config/constants.js";
import { createNotification } from "../notifications/notification.service.js";


export const enrollStudent = async (data, createdById) => {
  const { studentId, batchId } = data;

  console.log("🎓 enrollStudent - studentId:", studentId, "batchId:", batchId);

  // 1️⃣ Validate student exists
  const student = await User.findById(studentId);
  if (!student) {
    throw new Error("Student not found");
  }

  if (student.role !== ROLES.STUDENT) {
    throw new Error("User is not a student");
  }

  // 2️⃣ Validate batch exists
  const batch = await Batch.findById(batchId);
  if (!batch) {
    throw new Error("Batch not found");
  }

  if (!batch.isActive) {
    throw new Error("Batch is not active");
  }

  // 3️⃣ Check capacity
  if (batch.enrolledCount >= batch.capacity) {
    throw new Error("Batch capacity full");
  }

  // 4️⃣ Create enrollment (unique index will prevent duplicate)
  const enrollment = await Enrollment.create({
    student: studentId,
    batch: batchId,
    ...(createdById && createdById !== "admin-env" && mongoose.Types.ObjectId.isValid(createdById) ? { createdBy: createdById } : {}),
  });

  console.log("✅ enrollStudent - Created enrollment:", enrollment._id);

  // 🔔 Notify Student
  await createNotification({
    recipient: studentId,
    title: "Enrollment Successful",
    message: "You have been enrolled in a new batch.",
    type: "ENROLLMENT",
    relatedEntity: enrollment._id,
  });

  // 5️⃣ Increment enrolledCount
  batch.enrolledCount += 1;
  await batch.save();

  return enrollment;
};

export const getAllEnrollments = async () => {
  console.log("📖 getAllEnrollments");
  return await Enrollment.find()
    .populate("student", "name email")
    .populate({
      path: "batch",
      populate: { path: "course", select: "title" },
    })
    .populate("createdBy", "name email role");
};

export const getEnrollmentsByStudent = async (studentId) => {
  console.log("📖 getEnrollmentsByStudent - studentId:", studentId);
  return await Enrollment.find({ student: studentId })
    .populate({
      path: "batch",
      populate: { path: "course", select: "title" },
    });
};

export const updateEnrollment = async (enrollmentId, data) => {
  const { student: studentId, batch: batchId, status } = data;

  console.log("✏️ updateEnrollment - enrollmentId:", enrollmentId);
  console.log("✏️ updateEnrollment - studentId:", studentId, "batchId:", batchId, "status:", status);

  // 1️⃣ Check if enrollment exists
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  // 2️⃣ Validate new student (if provided)
  if (studentId && studentId !== enrollment.student.toString()) {
    const student = await User.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    if (student.role !== ROLES.STUDENT) {
      throw new Error("User is not a student");
    }

    // Check for duplicate enrollment
    const duplicateEnrollment = await Enrollment.findOne({
      student: studentId,
      batch: batchId || enrollment.batch,
    });

    if (duplicateEnrollment) {
      throw new Error("Student is already enrolled in this batch");
    }
  }

  // 3️⃣ Validate new batch (if provided)
  if (batchId && batchId !== enrollment.batch.toString()) {
    const batch = await Batch.findById(batchId);
    if (!batch) {
      throw new Error("Batch not found");
    }

    if (!batch.isActive) {
      throw new Error("Batch is not active");
    }

    // Check capacity of new batch
    if (batch.enrolledCount >= batch.capacity) {
      throw new Error("New batch capacity is full");
    }

    // Check for duplicate enrollment in new batch
    const duplicateEnrollment = await Enrollment.findOne({
      student: studentId || enrollment.student,
      batch: batchId,
    });

    if (duplicateEnrollment) {
      throw new Error("Student is already enrolled in this batch");
    }

    // Update batch counts if batch is changing
    const oldBatch = await Batch.findById(enrollment.batch);
    oldBatch.enrolledCount -= 1;
    await oldBatch.save();

    batch.enrolledCount += 1;
    await batch.save();
  }

  // 4️⃣ Update enrollment (including status)
  const updatedEnrollment = await Enrollment.findByIdAndUpdate(
    enrollmentId,
    {
      student: studentId || enrollment.student,
      batch: batchId || enrollment.batch,
      status: status || enrollment.status,
    },
    { new: true, runValidators: true }
  )
    .populate("student", "name email")
    .populate({
      path: "batch",
      populate: { path: "course", select: "title" },
    })
    .populate("createdBy", "name email role");

  console.log("✅ updateEnrollment - Success:", updatedEnrollment._id);

  // 🔔 Notify student of change
  if (studentId) {
    await createNotification({
      recipient: studentId,
      title: "Enrollment Updated",
      message: "Your enrollment details have been updated.",
      type: "ENROLLMENT",
      relatedEntity: enrollmentId,
    });
  }

  return updatedEnrollment;
};

export const deleteEnrollment = async (enrollmentId) => {
  console.log("🗑️ deleteEnrollment - enrollmentId:", enrollmentId);

  // 1️⃣ Check if enrollment exists (without populate first)
  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  console.log("🗑️ deleteEnrollment - Found enrollment:", enrollment._id);

  // 2️⃣ Decrement batch enrolledCount
  if (enrollment.batch) {
    const batch = await Batch.findById(enrollment.batch);
    if (batch) {
      batch.enrolledCount = Math.max(0, batch.enrolledCount - 1);
      await batch.save();
      console.log("🗑️ deleteEnrollment - Updated batch count:", batch.enrolledCount);
    }
  }

  // 3️⃣ Get student ID for notification (before deleting)
  const studentId = enrollment.student;

  // 4️⃣ Delete enrollment
  await Enrollment.findByIdAndDelete(enrollmentId);
  console.log("🗑️ deleteEnrollment - Enrollment deleted");

  // 5️⃣ Get batch name for notification
  let batchName = "Unknown Batch";
  if (enrollment.batch) {
    const batchData = await Batch.findById(enrollment.batch);
    if (batchData) {
      batchName = batchData.name;
    }
  }

  // 🔔 Notify student of unenrollment
  if (studentId) {
    await createNotification({
      recipient: studentId,
      title: "Enrollment Removed",
      message: `You have been removed from the batch: ${batchName}`,
      type: "ENROLLMENT",
      relatedEntity: enrollmentId,
    });
  }

  return enrollment;
};