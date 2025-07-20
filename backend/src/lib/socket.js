import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

// store online users
const userSocketMap = {}; // {userId: socketId}s

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  //   io.emit() is used to send messages to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", (socket) => {
    console.log("Client disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, httpServer };
