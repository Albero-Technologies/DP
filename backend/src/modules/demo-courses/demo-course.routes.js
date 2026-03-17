import express from "express";
import { getAllDemoCourses, createDemoCourse, updateDemoCourse, deleteDemoCourse } from "./demo-course.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();

// Public for all logged-in users (students can view)
router.get("/", protect, getAllDemoCourses);
// Admin only for CUD
router.post("/", protect, authorizeRoles(ROLES.ADMIN), createDemoCourse);
router.put("/:id", protect, authorizeRoles(ROLES.ADMIN), updateDemoCourse);
router.delete("/:id", protect, authorizeRoles(ROLES.ADMIN), deleteDemoCourse);

export default router;
