import express from "express";
import {
  createSession, getSessionsByBatch, getMyTrainerSessions,
  updateSession, deleteSession, assignTrainerToBatch,
} from "./session.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();
const counselorAdmin = [protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR)];

router.get("/",         protect,   getSessionsByBatch);
router.get("/trainer",  protect, authorizeRoles(ROLES.TRAINER, ROLES.ADMIN), getMyTrainerSessions);
router.post("/",        ...counselorAdmin, createSession);
router.post("/assign-trainer", ...counselorAdmin, assignTrainerToBatch);
router.put("/:id",      ...counselorAdmin, updateSession);
router.delete("/:id",   ...counselorAdmin, deleteSession);

export default router;