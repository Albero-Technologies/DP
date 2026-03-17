import express from "express";
import userRoutes from "../modules/users/user.routes.js";
import courseRoutes from "../modules/courses/course.routes.js";
import batchRoutes from "../modules/batches/batch.routes.js";
import enrollmentRoutes from "../modules/enrollments/enrollment.routes.js";
import financeRoutes from "../modules/finance/finance.routes.js";
import reportsRoutes from "../modules/reports/reports.routes.js";
import notificationRoutes from "../modules/notifications/notification.routes.js";
import studentRoutes from "../modules/students/student.routes.js";
import studentPortalRoutes from "../modules/students/student-portal.routes.js";
import supportRoutes from "../modules/support/support.routes.js";
import trainerRoutes from "../modules/trainer/trainer.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import demoCourseRoutes from "../modules/demo-courses/demo-course.routes.js";
import counselorRoutes from "../modules/leads/lead.routes.js";
import sessionRoutes from "../modules/sessions/session.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/batches", batchRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/finance", financeRoutes);
router.use("/reports", reportsRoutes);
router.use("/notifications", notificationRoutes);
router.use("/students", studentRoutes);
router.use("/student", studentPortalRoutes);
router.use("/support", supportRoutes);
router.use("/trainer", trainerRoutes);

// New v2 routes
router.use("/admin", adminRoutes);
router.use("/demo-courses", demoCourseRoutes);
router.use("/counselor", counselorRoutes);
router.use("/sessions", sessionRoutes);

export default router;