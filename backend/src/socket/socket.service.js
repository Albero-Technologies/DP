// Socket.IO service — real-time notifications for all roles
// Usage: import { initSocket, emitToUser, emitToRole } from './socket.service.js'

let io;

// Map: userId → Set of socket IDs (user can have multiple tabs)
const userSockets = new Map();

export function initSocket(socketIo) {
  io = socketIo;

  io.on("connection", (socket) => {
    // Client sends: socket.emit("authenticate", { userId, role })
    socket.on("authenticate", ({ userId, role }) => {
      if (!userId) return;

      // Store mapping
      if (!userSockets.has(userId)) userSockets.set(userId, new Set());
      userSockets.get(userId).add(socket.id);

      // Join personal room + role room
      socket.join(`user:${userId}`);
      socket.join(`role:${role}`);

      socket.on("disconnect", () => {
        const sockets = userSockets.get(userId);
        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) userSockets.delete(userId);
        }
      });
    });
  });
}

// Emit to a specific user
export function emitToUser(userId, event, payload) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}

// Emit to all users of a role (admin, counselor, trainer, student)
export function emitToRole(role, event, payload) {
  if (!io) return;
  io.to(`role:${role.toUpperCase()}`).emit(event, payload);
}

// Emit new notification to recipient + admins
export function emitNotification(recipientId, role, notification) {
  emitToUser(String(recipientId), "notification:new", notification);
  // Also push to admin room for global visibility
  if (role !== "ADMIN") {
    emitToRole("ADMIN", "notification:new", notification);
  }
}