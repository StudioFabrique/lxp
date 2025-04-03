import { Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import CustomRequest from "../utils/interfaces/express/custom-request";

export const uploadCompanyLogo = () => {
  const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, path.join(__dirname, "..", "..", "uploads", "company"));
    },
    filename: async function (_req: CustomRequest, file, cb) {
      if (file.mimetype.startsWith("image")) {
        const ext = file.mimetype.split("/")[1];

        if (ext !== "jpeg" && ext !== "jpg" && ext !== "png") {
          cb(
            new Error("L'extension n'est pas au format .jpeg, .jpg ou .png"),
            "company-logo.jpeg",
          );
          return;
        }

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
        // Check if it's an image
        if (!file.mimetype.startsWith("image")) {
          cb(null, false);
          return;
        }

        // Check file extension
        const ext = file.mimetype.split("/")[1];
        if (ext !== "jpeg" && ext !== "jpg" && ext !== "png") {
          cb(null, false);
          return;
        }

        cb(null, true);
      },
    }).single("image");

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          message: "La taille du fichier dépasse la taille autorisée",
        });
      } else if (err) {
        return res.status(400).json({
          message:
            err.message ||
            "Une erreur est survenue lors du téléversement du fichier",
        });
      }

      // Check if file exists
      if (!req.file) {
        return res.status(400).json({
          message:
            "Aucun fichier n'a été téléversé. Assurez-vous que le fichier respecte le bon format.",
        });
      }

      next();
    });
  };
};
