import express from "express";
import {
  getAllStudents,
  getStudentsByCounselor,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "./student.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();

// Admin only
router.get("/",             protect, authorizeRoles(ROLES.ADMIN), getAllStudents);
router.get("/by-counselor", protect, authorizeRoles(ROLES.ADMIN), getStudentsByCounselor);
router.delete("/:id",       protect, authorizeRoles(ROLES.ADMIN), deleteStudent);

// Admin + Counselor (counselor can view/edit their own students)
router.get("/:id", protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR), getStudentById);
router.put("/:id", protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR), updateStudent);

export default router;