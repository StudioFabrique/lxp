import { type Response, type NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs"; // Import File System module
import sharp from "sharp";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";
import { logger } from "../utils/logs/logger.ts";

const logoMaxWidth = 512;
const logoMaxHeight = 256;

async function optimizeLogo(file: Express.Multer.File) {
  const optimizedPath = `${file.path}.optimized`;
  const image = sharp(file.path)
    .rotate()
    .resize(logoMaxWidth, logoMaxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });

  if (file.mimetype === "image/png") {
    await image
      .png({ compressionLevel: 9, effort: 10, palette: true, quality: 80 })
      .toFile(optimizedPath);
  } else {
    await image.jpeg({ quality: 75, mozjpeg: true }).toFile(optimizedPath);
  }

  await fs.promises.rename(optimizedPath, file.path);
}

export const uploadInstanceLogo = () => {
  const destinationPath = path.join(
    import.meta.dirname,
    "..",
    "..",
    "uploads",
    "instance",
  );

  const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      fs.mkdir(destinationPath, { recursive: true }, (error) => {
        cb(error, destinationPath);
      });
    },
    filename: async function (_req: CustomRequest, file, cb) {
      if (file.mimetype.startsWith("image")) {
        // Force the filename to be constant
        cb(null, "instance-logo.jpeg");
      } else {
        cb(new Error("Le fichier doit être une image"), "instance-logo.jpeg");
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

      if (req.file) {
        try {
          await optimizeLogo(req.file);
        } catch (optimizationError) {
          await Promise.all([
            fs.promises.rm(req.file.path, { force: true }),
            fs.promises.rm(`${req.file.path}.optimized`, { force: true }),
          ]);
          logger.error("Error optimizing instance logo:", optimizationError);
          return res.status(400).json({
            message: "Le logo n'a pas pu être traité.",
          });
        }
      }

      if (hasValidColor) {
        const colorFilePath = path.join(destinationPath, "instance-color.txt");

        try {
          await fs.promises.mkdir(destinationPath, { recursive: true });
          await fs.promises.writeFile(colorFilePath, colorData, "utf8");
        } catch (writeError) {
          logger.error("Error writing color file:", writeError);
          return res.status(500).json({
            message: "La couleur de fond n'a pas pu être sauvegardée.",
          });
        }
      }

      next();
    });
  };
};
