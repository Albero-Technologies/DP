import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./socket/socket.service.js";

// Models — register all so Mongoose knows about them
import "./modules/users/user.model.js";
import "./modules/courses/course.model.js";
import "./modules/batches/batch.model.js";
import "./modules/enrollments/enrollment.model.js";
import "./modules/finance/invoice.model.js";
import "./modules/finance/payment.model.js";
import "./modules/notifications/notification.model.js";
import "./modules/support/support.model.js";
import "./modules/demo-courses/demo-course.model.js";
import "./modules/sessions/session.model.js";
import "./modules/counselor/counselor-lead.model.js";
import "./modules/counselor/payment-reminder.model.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocket(io);

// Make io accessible in controllers if needed
app.set("io", io);

server.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);