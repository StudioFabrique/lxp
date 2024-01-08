import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { serverIssue } from "../utils/constantes";

export const uploadActivityVideo = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(
        null,
        path.join(__dirname, "..", "..", "uploads", "activities", "videos")
      );
    },
    filename: function (req, file, cb) {
      if (file.mimetype.startsWith("video")) {
        const uniqueID: string = uuidv4();
        const fileName: string = uniqueID + new Date().getTime();
        cb(null, file.fieldname + "-" + fileName + file.originalname);
      } else {
        console.log("oops");
      }
    },
  });

  return (req: Request, res: Response, next: NextFunction) => {
    console.log("from middleware with love");
    const upload = multer({
      storage: storage,
      limits: { fileSize: 100 * 1024 * 1024 * 1024 },
    }).single("video");

    upload(req, res, function (err: any) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).json({
          message: "La taille du fichier dépasse la taille autorisée.",
        });
      } else if (err) {
        // An unknown error occurred.
        return res.status(500).json({ message: err.message });
      }
      next();
    });
  };
};
