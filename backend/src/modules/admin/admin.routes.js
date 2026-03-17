import express from "express";
import {
  createCounselor, getAllCounselors, updateCounselor, deleteCounselor,
  createTrainer, getAllTrainers, updateTrainer, deleteTrainer,
  getAllPayments, getPaymentsByStudent, updatePaymentStatus,
  assignTrainer,
} from "./admin.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();
const adminOnly = [protect, authorizeRoles(ROLES.ADMIN)];

// Counselors
router.get("/counselors", ...adminOnly, getAllCounselors);
router.post("/create-counselor", ...adminOnly, createCounselor);
router.put("/update-counselor/:id", ...adminOnly, updateCounselor);
router.delete("/delete-counselor/:id", ...adminOnly, deleteCounselor);

// Trainers
router.get("/trainers", protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR), getAllTrainers);
router.post("/create-trainer", ...adminOnly, createTrainer);
router.put("/update-trainer/:id", ...adminOnly, updateTrainer);
router.delete("/delete-trainer/:id", ...adminOnly, deleteTrainer);

// Payments
router.get("/payments", ...adminOnly, getAllPayments);
router.get("/payments/:studentId", ...adminOnly, getPaymentsByStudent);
router.put("/payments/:id/status", ...adminOnly, updatePaymentStatus);

// Assign trainer
router.post("/assign-trainer", ...adminOnly, assignTrainer);

export default router;