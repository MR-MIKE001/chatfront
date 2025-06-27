import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "unauthorized no token provided" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res
        .status(401)
        .json({ message: "unauthorized no token provided" });
    }
    const user = await User.findOne({ _id: decode.userId }).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "unauthorized no token provided" });
    }
    req.user = user;
    next();
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "internal server error" });
  }
};
