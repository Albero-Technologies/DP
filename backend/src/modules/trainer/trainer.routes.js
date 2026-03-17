import express from "express";
import { getTrainerBatches, getTrainerStudents } from "./trainer.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();

router.get("/batches", protect, authorizeRoles(ROLES.TRAINER, ROLES.ADMIN), getTrainerBatches);
router.get("/students", protect, authorizeRoles(ROLES.TRAINER, ROLES.ADMIN), getTrainerStudents);

export default router;
