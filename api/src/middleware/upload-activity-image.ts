import { Response, NextFunction } from "express";

import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../utils/db";
import CustomRequest from "../utils/interfaces/express/custom-request";

export const uploadActivityImage = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(
        null,
        path.join(__dirname, "..", "..", "uploads", "activities", "images")
      );
    },
    filename: async function (req: CustomRequest, file, cb) {
      if (file.mimetype.startsWith("image")) {
        const uniqueID: string = uuidv4();
        const fileName: string = uniqueID;
        const ext = file.mimetype.split("/")[1];

        cb(null, file.fieldname + "-" + fileName + "." + ext);
      } else {
        console.log("oops");
      }
    },
  });

  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const upload = multer({
      storage: storage,
      limits: { fileSize: 10 * 1024 * 1024 },
    }).single("image");

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).json({
          message: "La taille du fichier dépasse la taille autorisée.",
        });
      } else if (err) {
        // An unknown error occurred.
        return res.status(500).json({ message: err });
      }
      next();
    });
  };
};
