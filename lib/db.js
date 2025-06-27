import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log(error);
  }
};
