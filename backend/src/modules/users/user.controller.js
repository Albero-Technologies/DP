import { createUser, loginUser } from "./user.service.js";
import generateToken from "../../utils/generateToken.js";

// POST /api/users/register — Students only
export const registerUser = async (req, res) => {
  try {
    const { role } = req.body;
    if (role && role.toUpperCase() !== "STUDENT") {
      return res.status(403).json({ success: false, message: "Only students can self-register. Other accounts are created by Admin." });
    }
    const user = await createUser({ ...req.body, role: "STUDENT" });
    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/users/login — All roles + Admin via .env
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminId = (process.env.ADMIN_ID || "").trim();
    const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();

    // Match admin if email equals ADMIN_ID exactly (e.g. "admin")
    // OR equals ADMIN_ID@admin.com for email-style login
    const isAdminLogin =
      adminId &&
      adminPassword &&
      password === adminPassword &&
      (email.trim() === adminId || email.trim() === `${adminId}@admin.com`);

    if (isAdminLogin) {
      const adminPayload = {
        _id: "admin-env",
        id: "admin-env",
        name: "Administrator",
        email: adminId,
        role: "ADMIN",
      };
      const token = generateToken(adminPayload);
      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        token,
        data: adminPayload,
      });
    }

    // Normal DB login for STUDENT, TRAINER, COUNSELOR
    const user = await loginUser(email.trim(), password);
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};