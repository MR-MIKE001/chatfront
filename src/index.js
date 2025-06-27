import express from "express";
import authRoutes from "../routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "../lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "../routes/message.route.js";
import cors from "cors";
import { app, server } from "../lib/socket.js";

dotenv.config();
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_PORT,
    credentials: true,
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const port = process.env.PORT || 5001;

server.listen(port, () => {
  console.log("listening");
  connectDB();
});
