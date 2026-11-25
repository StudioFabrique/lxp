import { type Response, type NextFunction } from "express";

import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";

export const uploadActivityImage = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(
        null,
        path.join(import.meta.dirname, "..", "..", "uploads", "activities", "images"),
      );
    },
    filename: async function (req: CustomRequest, file, cb) {
      if (file.mimetype.startsWith("image")) {
        const uniqueID: string = randomUUID();
        const fileName: string = uniqueID;
        // Le type MIME vient du client : seule une extension alphanumérique
        // est conservée pour empêcher toute sortie du répertoire d'envoi.
        const ext = (file.mimetype.split("/")[1] ?? "").replace(/[^a-z0-9]/gi, "");
        const fieldName = file.fieldname.replace(/[^a-z0-9_-]/gi, "");

        cb(null, fieldName + "-" + fileName + "." + ext);
        return;
      }
      cb(new Error("Le fichier doit être une image."), "");
    },
  });

  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const upload = multer({
      storage: storage,
      limits: { fileSize: 50 * 1024 * 1024 }, // 50 Mo
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
