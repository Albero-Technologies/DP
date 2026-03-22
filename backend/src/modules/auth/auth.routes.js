import express from "express";
import { login, getMe, changePassword } from "./auth.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Single login for all roles — Student signup REMOVED
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);

export default router;