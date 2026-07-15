import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
   // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage, 
  limits: {
    fileSize: 10*1024*1024,
    files: 1,
  },
  fileFilter: (req,file, cb) => {
    const allowedTypes = [
     "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf"];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new ApiError(404, "file should be jpeg or jpg or png or pdf")
  }
  cb(null, true);
  }
});