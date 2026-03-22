import express from "express";
import {
  createCashfreeOrder,
  verifyCashfreePayment,
  cashfreeWebhook,
  getInvoiceForPayment,
} from "./cashfree.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();

// Student — create payment order
router.post(
  "/cashfree/create-order",
  protect,
  authorizeRoles(ROLES.STUDENT),
  createCashfreeOrder
);

// Student — verify after redirect back
router.post(
  "/cashfree/verify",
  protect,
  authorizeRoles(ROLES.STUDENT),
  verifyCashfreePayment
);

// Student — get invoice details
router.get(
  "/cashfree/invoice/:invoiceId",
  protect,
  authorizeRoles(ROLES.STUDENT),
  getInvoiceForPayment
);

// Public — Cashfree webhook (no auth)
router.post("/cashfree/webhook", cashfreeWebhook);

export default router;