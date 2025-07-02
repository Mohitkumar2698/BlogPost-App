import express from "express";
import { connectDB } from "./database/connection.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import blogRouter from "./routes/blog.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
dotenv.config();

const corsOptions = {
  origin: `${process.env.FRONTEND_URI}`,
  credentials: true,
};

const Port = 4000;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(cors(corsOptions));

server.use("/api/v1", userRouter);
server.use("/api/v1", blogRouter);

server.listen(Port, () => {
  connectDB();
  console.log(`Server is Running on ${Port}`);
});
