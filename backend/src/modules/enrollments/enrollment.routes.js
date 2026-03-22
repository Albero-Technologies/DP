import express from "express";
import {
  enrollStudentHandler,
  getAllEnrollmentsHandler,
  getMyEnrollmentsHandler,
  updateEnrollmentHandler,
  deleteEnrollmentHandler,
} from "./enrollment.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";
import Enrollment from "./enrollment.model.js";

const router = express.Router();

// POST /api/enrollments — enroll student
router.post("/", protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR), enrollStudentHandler);

// GET /api/enrollments — all enrollments (admin) OR by studentId query param (counselor/admin)
router.get("/", protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR), async (req, res) => {
  try {
    const { studentId } = req.query;
    const filter = studentId ? { student: studentId } : {};

    const enrollments = await Enrollment.find(filter)
      .populate({ path: "batch", populate: [
        { path: "course", select: "title fees" },
        { path: "trainer", select: "name email" },
      ]})
      .populate("student", "name email studentId")
      .sort("-createdAt");

    res.json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/enrollments/my — student's own enrollments
router.get("/my", protect, authorizeRoles(ROLES.STUDENT), getMyEnrollmentsHandler);

// PUT /api/enrollments/:id
router.put("/:id", protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR), updateEnrollmentHandler);

// DELETE /api/enrollments/:id
router.delete("/:id", protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR), deleteEnrollmentHandler);

export default router;