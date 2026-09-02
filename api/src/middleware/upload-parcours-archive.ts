import type { NextFunction, Response } from "express";
import multer from "multer";

import type CustomRequest from "../utils/interfaces/express/custom-request.ts";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 250 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const isZip =
      file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed" ||
      file.originalname.toLowerCase().endsWith(".zip");
    if (!isZip) {
      callback(new Error("Seuls les fichiers ZIP sont acceptés."));
      return;
    }
    callback(null, true);
  },
}).single("archive");

export default function uploadParcoursArchive(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  upload(req, res, (error) => {
    if (!error) return next();
    const tooLarge =
      error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE";
    return res.status(tooLarge ? 413 : 400).json({
      message: tooLarge
        ? "L'archive dépasse la taille maximale autorisée de 250 Mo."
        : error.message,
    });
  });
}
