import jwt from "jsonwebtoken";
import User from "../modules/users/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ── ENV Admin: token id is "admin-env", no DB lookup needed ──
    if (decoded.id === "admin-env") {
      req.user = {
        _id: "admin-env",
        id: "admin-env",
        name: "Administrator",
        email: process.env.ADMIN_ID || "admin",
        role: "ADMIN",
        isActive: true,
      };
      return next();
    }

    // ── Normal DB users ──
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};