import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "email already exist " });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullname,
      email,
      password: hashPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilepic: newUser.profilepic,
      });
    } else {
      res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const pass = password;

    const isPasswordCor = await bcrypt.compare(pass, user.password);

    if (!isPasswordCor) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilepic: user.profilepic,
    });
  } catch (error) {
    console.log(error.message);
  }
};
export const logout = async (req, res) => {
  try {
    await res.cookie("jwt", "", "");
    await res.status(200).json({ message: "logged out" });
  } catch (error) {
    console.log(error.message);
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilepic } = req.body;

    const userID = req.user._id;
    if (!profilepic) {
      return res.status(400).json({ message: "profile pic is required" });
    }

    const UploadRes = await cloudinary.uploader.upload(profilepic);
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { profilepic: UploadRes.secure_url },
      { new: true },
    );

    res.status(200).json({ message: "updated user" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server  erro" });
  }
};
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "internal server error" });
  }
};

// {
//   "fullname": "ike jhn"  ,
//   "email": "hdkj@gmail.com",
//   "password": "jkgbdtufnh"
// }
