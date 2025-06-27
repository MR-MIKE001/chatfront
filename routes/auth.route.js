import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleWare.js";
import { updateProfile } from "../controllers/auth.controller.js";
import { checkAuth } from "../controllers/auth.controller.js";
const routa = express.Router();

routa.post("/signup", signup);
routa.post("/login", login);
routa.post("/logout", logout);
routa.put("/update-profile", protectRoute, updateProfile);
routa.get("/check", protectRoute, checkAuth);

//mongoose.connect('mongodb://127.0.0.1:27017/fruitdb');
export default routa;
