import { connect } from "mongoose";

export const connectDB = async () => {
  await connect(process.env.MONGODB_URI);
  console.log("Database Connected!");
};
