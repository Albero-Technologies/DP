import express from "express";
import authRoutes          from "../modules/auth/auth.routes.js";
import userRoutes          from "../modules/users/user.routes.js";
import courseRoutes        from "../modules/courses/course.routes.js";
import batchRoutes         from "../modules/batches/batch.routes.js";
import enrollmentRoutes    from "../modules/enrollments/enrollment.routes.js";
import financeRoutes       from "../modules/finance/finance.routes.js";
import reportsRoutes       from "../modules/reports/reports.routes.js";
import notificationRoutes  from "../modules/notifications/notification.routes.js";
import studentRoutes       from "../modules/students/student.routes.js";
import studentPortalRoutes from "../modules/students/student-portal.routes.js";
import supportRoutes       from "../modules/support/support.routes.js";
import trainerRoutes       from "../modules/trainer/trainer.routes.js";
import adminRoutes         from "../modules/admin/admin.routes.js";
import demoCourseRoutes    from "../modules/demo-courses/demo-course.routes.js";
import sessionRoutes       from "../modules/sessions/session.routes.js";
import counselorRoutes     from "../modules/counselor/counselor.routes.js";
import cashfreeRoutes      from "../modules/payments/cashfree.routes.js";

const router = express.Router();

// Auth
router.use("/auth",          authRoutes);

// Core
router.use("/users",         userRoutes);
router.use("/courses",       courseRoutes);
router.use("/batches",       batchRoutes);
router.use("/enrollments",   enrollmentRoutes);
router.use("/finance",       financeRoutes);
router.use("/reports",       reportsRoutes);      // Dashboard ke liye zaroori — KEEP
router.use("/notifications", notificationRoutes);
router.use("/sessions",      sessionRoutes);
router.use("/demo-courses",  demoCourseRoutes);
router.use("/support",       supportRoutes);

// Role-scoped
router.use("/students",      studentRoutes);
router.use("/student",       studentPortalRoutes);
router.use("/trainer",       trainerRoutes);
router.use("/admin",         adminRoutes);
router.use("/counselor",     counselorRoutes);
router.use("/payments",      cashfreeRoutes);

export default router;