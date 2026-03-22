import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title:   { type: String, required: true },
    message: { type: String, required: true },

    type: {
      type: String,
      enum: [
        "ENROLLMENT",
        "INVOICE",
        "PAYMENT",
        "BATCH",
        "GENERAL",
        "SESSION",
        "CONTENT",
        "ACCESS",
        "REMINDER",
      ],
      default: "GENERAL",
    },

    isRead: { type: Boolean, default: false },

    relatedEntity: { type: mongoose.Schema.Types.ObjectId },
    relatedModel:  { type: String },  // e.g. "Payment", "Enrollment"
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;