import express from "express";
import {
  getDashboardStats,
  createCounselor, getAllCounselors, updateCounselor, deleteCounselor,
  createTrainer, getAllTrainers, updateTrainer, deleteTrainer,
  getAllPayments, getPaymentsByStudent, updatePaymentStatus, editPayment, deletePayment,
  assignTrainersToBatch,
  addCourseVideo, deleteCourseVideo,
  addDemoCourseVideo, deleteDemoCourseVideo,
  setStudentDiscount,
  updateStudentAccess,
} from "./admin.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();
const adminOnly = [protect, authorizeRoles(ROLES.ADMIN)];

// Dashboard stats
router.get("/dashboard-stats", ...adminOnly, getDashboardStats);

// Counselors
router.get("/counselors",              ...adminOnly, getAllCounselors);
router.post("/create-counselor",       ...adminOnly, createCounselor);
router.put("/update-counselor/:id",    ...adminOnly, updateCounselor);
router.delete("/delete-counselor/:id", ...adminOnly, deleteCounselor);

// Trainers
router.get("/trainers",               protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR), getAllTrainers);
router.post("/create-trainer",        ...adminOnly, createTrainer);
router.put("/update-trainer/:id",     ...adminOnly, updateTrainer);
router.delete("/delete-trainer/:id",  ...adminOnly, deleteTrainer);

// Payments
router.get("/payments",                   ...adminOnly, getAllPayments);
router.get("/payments/:studentId",        protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR), getPaymentsByStudent);
router.put("/payments/:id/status",        ...adminOnly, updatePaymentStatus);
router.put("/payments/:id/edit",          ...adminOnly, editPayment);
router.delete("/payments/:id",            ...adminOnly, deletePayment);

// Batch multi-trainer — counselor can also assign trainers
router.post("/batches/:batchId/trainers", protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR), assignTrainersToBatch);

// Course videos
router.post("/courses/:courseId/videos",           ...adminOnly, addCourseVideo);
router.delete("/courses/:courseId/videos/:videoId", ...adminOnly, deleteCourseVideo);

// Demo course videos
router.post("/demo-courses/:demoId/videos",            ...adminOnly, addDemoCourseVideo);
router.delete("/demo-courses/:demoId/videos/:videoId",  ...adminOnly, deleteDemoCourseVideo);

// Student discount per enrollment
router.patch("/enrollments/:enrollmentId/discount", ...adminOnly, setStudentDiscount);

// Student access status
router.patch("/students/:id/access", ...adminOnly, updateStudentAccess);

export default router;