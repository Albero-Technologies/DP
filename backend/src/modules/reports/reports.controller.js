import {
  getAdminDashboardStats,
  getTrainerDashboardStats,
  getCounselorDashboardStats,
  getStudentDashboardStats,
} from "./reports.service.js";

// Admin dashboard
export const getAdminDashboardHandler = async (req, res) => {
  try {
    const stats = await getAdminDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Trainer dashboard
export const getTrainerDashboardHandler = async (req, res) => {
  try {
    const stats = await getTrainerDashboardStats(req.user._id);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Counselor dashboard — pass counselorId so only their data is returned
export const getCounselorDashboardHandler = async (req, res) => {
  try {
    const stats = await getCounselorDashboardStats(req.user._id);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Student dashboard
export const getStudentDashboardHandler = async (req, res) => {
  try {
    const stats = await getStudentDashboardStats(req.user._id);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};