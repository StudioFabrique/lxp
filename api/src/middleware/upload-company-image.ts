import { Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs"; // Import File System module
import CustomRequest from "../utils/interfaces/express/custom-request";

export const uploadCompanyLogo = () => {
  const destinationPath = path.join(
    __dirname,
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
      limits: { fileSize: 50 * 1024 * 1024 * 1024 },
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

    upload(req, res, function (err) {
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

      // 2. Handle Missing File
      if (!req.file) {
        return res.status(400).json({
          message: "Aucun fichier n'a été téléversé.",
        });
      }

      // 3. NEW LOGIC: Write the Color to a Text File
      // Multer populates req.body with text fields after processing the file
      const colorData = req.body.color;

      if (colorData) {
        const colorFilePath = path.join(destinationPath, "company-color.txt");

        // Write the color string to the file (overwrites if exists)
        fs.writeFile(colorFilePath, colorData, (writeErr) => {
          if (writeErr) {
            console.error("Error writing color file:", writeErr);
            // Optionally decide if you want to fail the request here,
            // usually better to log it and proceed if the image saved fine.
          }
        });
      }

      next();
    });
  };
};
