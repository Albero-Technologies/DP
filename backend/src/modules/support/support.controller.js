import Support from "./support.model.js";

export const createTicket = async (req, res) => {
  try {
    const ticket = await Support.create({ ...req.body, student: req.user._id });
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Support.find({ student: req.user._id }).sort("-createdAt");
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Support.find()
      .populate("student", "name email")
      .populate("repliedBy", "name")
      .sort("-createdAt");
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ FIX: accept status from request body, don't hardcode IN_PROGRESS
export const replyTicket = async (req, res) => {
  try {
    const { reply, status } = req.body;

    const updateData = {};
    if (reply) updateData.reply = reply;
    if (status) updateData.status = status;

    // Only set repliedBy if it's a real ObjectId
    const userId = req.user._id || req.user.id;
    if (userId && userId !== "admin-env") {
      updateData.repliedBy = userId;
    }

    const ticket = await Support.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("student", "name email");

    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};