import express from "express";
import { registerUser, login } from "./user.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);

// GET /me — works for both DB users and env admin
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user._id || req.user.id,
      _id: req.user._id || req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

router.get(
  "/admin-only",
  protect,
  authorizeRoles(ROLES.ADMIN),
  (req, res) => {
    res.json({ success: true, message: "Welcome Admin. You have access." });
  }
);

export default router;