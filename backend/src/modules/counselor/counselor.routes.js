import express from "express";
import {
  getEnrollLink,
  submitEnrollForm,
  getMyLeads,
  convertLeadToStudent,
  updateLead,
  getMyCounselorStudents,
  assignBatchesToStudent,
  removeStudentFromBatch,
  sendPaymentReminder,
  getMyReminders,
  updateReminderStatus,
} from "./counselor.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();
const counselorOnly = [protect, authorizeRoles(ROLES.COUNSELOR)];

// ── Enrollment link ─────────────────────────────────────────────
router.get("/enroll-link", ...counselorOnly, getEnrollLink);

// ── Public form submit (no auth) ────────────────────────────────
router.post("/enroll/:counselorId", submitEnrollForm);

// ── Leads management ────────────────────────────────────────────
router.get("/leads", ...counselorOnly, getMyLeads);
router.patch("/leads/:leadId", ...counselorOnly, updateLead);
router.post("/leads/:leadId/convert", ...counselorOnly, convertLeadToStudent);

// ── My Students ─────────────────────────────────────────────────
router.get("/students", ...counselorOnly, getMyCounselorStudents);

// ── Batch assignment ────────────────────────────────────────────
router.post("/students/:studentId/assign-batches", ...counselorOnly, assignBatchesToStudent);
router.delete("/students/:studentId/batches/:batchId", ...counselorOnly, removeStudentFromBatch);

// ── Payment reminders ───────────────────────────────────────────
router.post("/reminders", ...counselorOnly, sendPaymentReminder);
router.get("/reminders", ...counselorOnly, getMyReminders);
router.patch("/reminders/:reminderId", ...counselorOnly, updateReminderStatus);

export default router;