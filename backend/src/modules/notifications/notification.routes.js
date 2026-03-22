import express from "express";
import {
  getMyNotificationsHandler,
  markAsReadHandler,
  markAllAsReadHandler,
} from "./notification.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/notifications
router.get("/", protect, getMyNotificationsHandler);

// PATCH /api/notifications/read-all  ← MUST be before /:id/read
router.patch("/read-all",      protect, markAllAsReadHandler);
router.patch("/mark-all-read", protect, markAllAsReadHandler); // alias

// PATCH /api/notifications/:id/read
router.patch("/:id/read", protect, markAsReadHandler);

export default router;