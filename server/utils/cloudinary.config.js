import cloudinaryModule from "cloudinary";
const { v2: cloudinary } = cloudinaryModule;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "myFolder",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export { cloudinary, storage };
