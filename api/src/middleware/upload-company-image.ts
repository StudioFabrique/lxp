import { type Response, type NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs"; // Import File System module
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";

export const uploadCompanyLogo = () => {
  const destinationPath = path.join(
    import.meta.dirname,
    "..",
    "..",
    "uploads",
    "company"
  );

  const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, destinationPath);
    },
    filename: async function (_req: CustomRequest, file, cb) {
      if (file.mimetype.startsWith("image")) {
        // Force the filename to be constant
        cb(null, "company-logo.jpeg");
      } else {
        cb(new Error("Le fichier doit être une image"), "company-logo.jpeg");
      }
    },
  });

  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const upload = multer({
      storage: storage,
      limits: { fileSize: 50 * 1024 * 1024 }, // 50 Mo
      fileFilter: (_req, file, cb: multer.FileFilterCallback) => {
        if (!file.mimetype.startsWith("image")) {
          cb(null, false);
          return;
        }
        const ext = file.mimetype.split("/")[1];
        if (ext !== "jpeg" && ext !== "jpg" && ext !== "png") {
          cb(null, false);
          return;
        }
        cb(null, true);
      },
    }).single("image");

    upload(req, res, async function (err) {
      // 1. Handle Multer Errors
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          message: "La taille du fichier dépasse la taille autorisée",
        });
      } else if (err) {
        return res.status(400).json({
          message: err.message || "Erreur lors du téléversement",
        });
      }

      const colorData = req.body.color;
      const hasValidColor =
        typeof colorData === "string" && /^#[0-9a-f]{6}$/i.test(colorData);

      if (colorData !== undefined && !hasValidColor) {
        return res.status(400).json({
          message: "La couleur de fond est invalide.",
        });
      }

      if (!req.file && !hasValidColor) {
        return res.status(400).json({
          message: "Aucun logo ou couleur n'a été envoyé.",
        });
      }

      if (hasValidColor) {
        const colorFilePath = path.join(destinationPath, "company-color.txt");

        try {
          await fs.promises.writeFile(colorFilePath, colorData, "utf8");
        } catch (writeError) {
          console.error("Error writing color file:", writeError);
          return res.status(500).json({
            message: "La couleur de fond n'a pas pu être sauvegardée.",
          });
        }
      }

      next();
    });
  };
};
