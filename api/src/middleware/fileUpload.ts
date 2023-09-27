import { Request } from "express";
import multer from "multer";
import path from "path";
import * as fs from "fs";

export const getBase64ImageFromReq = async (req: Request): Promise<string> => {
  const image: any = req.file;
  const imageData = await fs.promises.readFile(image.path);
  const base64String = imageData.toString("base64");
  return base64String;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "uploads"));
  },
  filename: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      const newFileName =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname;
      cb(null, file.fieldname + "-" + newFileName);
    } else {
      console.log("problem with file :");
      console.log(file);
      return;
    }
  },
});

const fileUpload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
});

export default fileUpload;
