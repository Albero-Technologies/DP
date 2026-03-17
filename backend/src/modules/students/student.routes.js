import express from "express";
import {
  getAllStudents, getStudentById, updateStudent, deleteStudent,
  getStudentCourses, getStudentPayments, getStudentCertificates,
} from "./student.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();

// Admin routes
router.get("/", protect, authorizeRoles(ROLES.ADMIN), getAllStudents);
router.get("/:id", protect, authorizeRoles(ROLES.ADMIN), getStudentById);
router.put("/:id", protect, authorizeRoles(ROLES.ADMIN), updateStudent);
router.delete("/:id", protect, authorizeRoles(ROLES.ADMIN), deleteStudent);

export default router;
