import express from "express";
import { connectDB } from "./database/connection.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import blogRouter from "./routes/blog.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import { AppError, toAppError } from "./utils/appError.js";
dotenv.config();

const corsOptions = {
  origin: process.env.FRONTEND_URI || "http://localhost:5173",
  credentials: true,
};

const Port = process.env.PORT || 4000;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(cors(corsOptions));

server.use("/api/v1", userRouter);
server.use("/api/v1", blogRouter);

server.use((_req, _res, next) => {
  next(new AppError("Route not found", 404));
});

server.use((err, _req, res, _next) => {
  const parsedError = toAppError(err);
  const statusCode = parsedError.statusCode || 500;
  const message = parsedError.message || "Internal server error";

  if (process.env.NODE_ENV !== "production" && statusCode >= 500) {
    console.error("Unhandled server error:", err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    details: parsedError.details || undefined,
  });
});

server.listen(Port, () => {
  connectDB();
  console.log(`Server is Running on ${Port}`);
});
