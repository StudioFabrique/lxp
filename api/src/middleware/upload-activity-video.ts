import { type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "node:crypto";
import { displaySize } from "../helpers/size-unit-converter.ts";

export const uploadActivityVideo = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(
        null,
        path.join(import.meta.dirname, "..", "..", "uploads", "activities", "videos"),
      );
    },
    filename: function (req, file, cb) {
      if (file.mimetype.startsWith("video")) {
        const uniqueID: string = randomUUID();
        const fileName: string = uniqueID + new Date().getTime();
        cb(null, fileName + path.extname(file.originalname));
      } else {
      }
    },
  });

  return (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({
      storage: storage,
      limits: { fileSize: 50 * 1024 * 1024 }, // 100MB limit
    }).single("video");

    upload(req, res, function (err: any) {

      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: `La taille du fichier dépasse la limite autorisée de ${displaySize(
              50 * 1024 * 1024,
            )}.`,
          });
        }

        return res.status(400).json({
          message: "Une erreur est survenue lors du téléversement de la vidéo.",
        });
      } else if (err) {
        // An unknown error occurred.
        return res.status(500).json({ message: err.message });
      }
      next();
    });
  };
};
