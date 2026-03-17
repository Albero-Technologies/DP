import express from "express";
import {
  getStudentCourses, getAvailableBatches, selfEnroll,
  submitPayment, getStudentPayments, getStudentCertificates,
  getStudentNotifications, markNotificationRead, markAllNotificationsRead,
} from "./student.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();
const student = [protect, authorizeRoles(ROLES.STUDENT)];

router.get("/courses",                  ...student, getStudentCourses);
router.get("/available-batches",        ...student, getAvailableBatches);
router.post("/enroll",                  ...student, selfEnroll);
router.post("/pay",                     ...student, submitPayment);
router.get("/payments",                 ...student, getStudentPayments);
router.get("/certificates",             ...student, getStudentCertificates);
router.get("/notifications",            ...student, getStudentNotifications);
router.patch("/notifications/read-all", ...student, markAllNotificationsRead);
router.patch("/notifications/:id/read", ...student, markNotificationRead);

export default router;