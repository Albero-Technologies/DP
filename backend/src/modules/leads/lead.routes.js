import express from "express";
import {
  createStudent, getAllStudents, updateStudent, deleteStudent,
  assignTrainerToBatch, enrollStudentToBatch,
  createFollowUp, getFollowUps, updateFollowUp,
  sendPaymentReminder, getPendingPayments, updatePaymentApproval,
  getStudentsWithEnrollment, getAllPaymentsForCounselor,
} from "./lead.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();
const counselorAdmin = [protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR)];

// Students
router.get("/students", ...counselorAdmin, getAllStudents);
router.get("/students-with-enrollment", ...counselorAdmin, getStudentsWithEnrollment);
router.post("/students", ...counselorAdmin, createStudent);
router.put("/students/:id", ...counselorAdmin, updateStudent);
router.delete("/students/:id", ...counselorAdmin, deleteStudent);

// Assign + enroll
router.post("/assign-trainer", ...counselorAdmin, assignTrainerToBatch);
router.post("/enroll-student", ...counselorAdmin, enrollStudentToBatch);

// Follow-ups
router.get("/followups", ...counselorAdmin, getFollowUps);
router.post("/followups", ...counselorAdmin, createFollowUp);
router.put("/followups/:id", ...counselorAdmin, updateFollowUp);

// Payments
router.post("/payment-reminder", ...counselorAdmin, sendPaymentReminder);
router.get("/all-payments", ...counselorAdmin, getAllPaymentsForCounselor);
router.get("/pending-payments", ...counselorAdmin, getPendingPayments);
router.put("/payments/:id/status", ...counselorAdmin, updatePaymentApproval);

export default router;