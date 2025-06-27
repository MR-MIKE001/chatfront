import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
const app = express();
dotenv.config();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_PORT],
  },
});
export const getSocketID = (userid) => {
  return userSocketMap[userid];
};
const userSocketMap = {};
io.on("connection", (socket) => {
  const userid = socket.handshake.query.userid;
  if (userid) {
    userSocketMap[userid] = socket.id;
  }
  io.emit("getonlineusers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    delete userSocketMap[userid];
    io.emit("getonlineusers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
