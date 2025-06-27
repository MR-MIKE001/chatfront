import express from "express";
import { protectRoute } from "../middleware/auth.middleWare.js";
import {
  getUsersForSideBar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
const route = express.Router();

route.get("/users", protectRoute, getUsersForSideBar);
route.get("/:id", protectRoute, getMessages);
route.post("/send/:id", protectRoute, sendMessage);
export default route;
