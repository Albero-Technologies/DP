import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import { ROLES } from "../../config/constants.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POST /api/auth/login  — single login for ALL roles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    // ── ENV Admin check ──────────────────────────────────────
    const adminId  = process.env.ADMIN_ID;
    const adminPwd = process.env.ADMIN_PASSWORD;

    if (email === adminId && password === adminPwd) {
      const token = jwt.sign(
        { id: "admin-env" },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );
      return res.json({
        success: true,
        token,
        user: {
          id: "admin-env",
          name: "Administrator",
          email: adminId,
          role: ROLES.ADMIN,
        },
        redirectTo: "/admin/dashboard",
      });
    }

    // ── DB user login ────────────────────────────────────────
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Account is deactivated. Contact admin." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = signToken(user._id);

    // Role-based redirect path
    const redirectMap = {
      [ROLES.ADMIN]:     "/admin/dashboard",
      [ROLES.COUNSELOR]: "/counselor/dashboard",
      [ROLES.TRAINER]:   "/trainer/dashboard",
      [ROLES.STUDENT]:   "/student/dashboard",
    };

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessStatus: user.accessStatus,
        studentId: user.studentId,
      },
      redirectTo: redirectMap[user.role] || "/",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET /api/auth/me
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const getMe = async (req, res) => {
  try {
    // env admin
    if (req.user._id === "admin-env" || req.user.id === "admin-env") {
      return res.json({ success: true, user: req.user });
    }
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POST /api/auth/change-password
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: "Both fields required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};