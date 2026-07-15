import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "node:crypto";

export const uploadActivityFiles = () => {
  const storage = multer.diskStorage({
    destination: function (req, files, cb) {
      cb(
        null,
        path.join(__dirname, "..", "..", "uploads", "activities", "files"),
      );
    },
    filename: function (req, file, cb) {
      const allowedMimeTypes = [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/markdown",
      ];

      if (allowedMimeTypes.includes(file.mimetype)) {
        const uniqueID: string = randomUUID();
        const fileName: string = uniqueID + new Date().getTime();
        const ext = file.originalname.split(".").pop();

        cb(null, file.fieldname + "-" + fileName + "." + ext);
      } else {
        cb(new Error("Type de fichier non autorisé"), "");
      }
    },
  });

  return (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({
      storage: storage,
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          "application/pdf",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/markdown",
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(
            new Error(
              "Type de fichier non autorisé. Formats acceptés : PDF, PPT, PPTX, TXT, DOC, DOCX, XLS, XLSX, MD",
            ),
          );
        }
      },
    }).array("files", 10); // 'files' est le nom du champ, 10 est le nombre max de fichiers

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "La taille du fichier dépasse la taille autorisée (50MB).",
          });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            message: "Trop de fichiers envoyés (maximum 10.",
          });
        }
        return res.status(400).json({
          message: err.message,
        });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};
