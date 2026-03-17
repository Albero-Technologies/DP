import express from "express";
import { createTicket, getMyTickets, getAllTickets, replyTicket } from "./support.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();

router.post("/", protect, authorizeRoles(ROLES.STUDENT), createTicket);
router.get("/my", protect, authorizeRoles(ROLES.STUDENT), getMyTickets);
router.get("/", protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR), getAllTickets);
router.put("/:id/reply", protect, authorizeRoles(ROLES.ADMIN, ROLES.COUNSELOR), replyTicket);

export default router;
