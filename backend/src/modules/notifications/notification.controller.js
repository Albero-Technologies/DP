import Notification from "./notification.model.js";
import mongoose from "mongoose";

// GET /api/notifications
export const getMyNotificationsHandler = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // Admin-env login has no real ObjectId — return empty array
    if (!userId || userId === "admin-env" || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(200).json({ success: true, data: [] });
    }

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/notifications/:id/read
export const markAsReadHandler = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH /api/notifications/read-all
export const markAllAsReadHandler = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    if (!userId || userId === "admin-env" || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(200).json({ success: true, message: "No notifications to mark" });
    }
    await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};