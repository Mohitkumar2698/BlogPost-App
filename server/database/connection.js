import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
