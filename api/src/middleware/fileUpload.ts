import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import * as fs from "fs";
import { serverIssue } from "../utils/constantes";

export const getBase64ImageFromReq = async (req: Request): Promise<string> => {
  const image: any = req.file;
  const imageData = await fs.promises.readFile(image.path);
  const base64String = imageData.toString("base64");
  return base64String;
};

export async function deleteTempUploadedFile(req: Request) {
  if (req.file) {
    await fs.promises.unlink(req.file.path);
  }
}

export const createFileUploadMiddleware: any = (maxFileSize: number) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "..", "uploads"));
    },
    filename: function (req, file, cb) {
      if (file.mimetype.startsWith("image")) {
        const newFileName =
          Date.now() +
          "-" +
          Math.round(Math.random() * 1e9) +
          file.originalname;
        cb(null, file.fieldname + "-" + newFileName);
      } else {
        console.log("problem with file :");
        console.log(file);
        return;
      }
    },
  });

  return (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({
      storage: storage,
      limits: { fileSize: maxFileSize },
    }).single("image");

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).json({
          message: "La taille du fichier dépasse la taille autorisée.",
        });
      } else if (err) {
        // An unknown error occurred.
        return res.status(500).json({ message: serverIssue });
      }
      // No errors, continue with the next middleware or route handler.
      next();
    });
  };
};
