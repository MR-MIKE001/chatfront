import cloudinary from "../lib/cloudinary.js";
import { getSocketID, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserID = await req.user._id;

    const filterUsers = await User.find({
      _id: { $ne: loggedInUserID },
    }).select("-password");

    res.status(200).json(filterUsers);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = await req.params;
    const myID = await req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderID: myID,
          receiverID: userToChatId,
        },

        {
          senderID: userToChatId,
          receiverID: myID,
        },
      ],
    });
    res.status(200).json(messages);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverID } = req.params;
    const senderID = req.user._id;
    let imageURL;
    if (image) {
      const UploadRes = await cloudinary.uploader.upload(image);
      imageURL = UploadRes.secure_url;
    }
    const newMessage = new Message({
      senderID: senderID,
      receiverID: receiverID,
      text: text,
      image: imageURL,
    });
    await newMessage.save();
    // todo real time functionality
    const receiverSocketId = getSocketID(receiverID);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json(newMessage);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "internal server error" });
  }
};
