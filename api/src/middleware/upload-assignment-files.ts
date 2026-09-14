import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";

export const assignmentUploadsDirectory = path.join(
  import.meta.dirname,
  "..",
  "..",
  "uploads",
  "assignments",
);

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "text/markdown",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/** Fichiers privés : ils ne sont servis que par les routes authentifiées. */
export function uploadAssignmentFiles() {
  fs.mkdirSync(assignmentUploadsDirectory, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, callback) =>
      callback(null, assignmentUploadsDirectory),
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${randomUUID()}${extension}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024, files: 10 },
    fileFilter: (_req, file, callback) => {
      if (allowedMimeTypes.has(file.mimetype)) return callback(null, true);
      callback(new Error("Type de fichier non autorisé."));
    },
  }).array("files", 10);

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (error) => {
      if (!error) return next();
      const message =
        error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
          ? "Chaque fichier doit faire au maximum 50 Mo."
          : error instanceof multer.MulterError && error.code === "LIMIT_FILE_COUNT"
            ? "Dix fichiers maximum sont autorisés."
            : error.message;
      return res.status(400).json({ message });
    });
  };
}

export async function removeAssignmentFiles(storedNames: readonly string[]) {
  await Promise.all(
    storedNames.map((storedName) =>
      fs.promises
        .unlink(path.join(assignmentUploadsDirectory, path.basename(storedName)))
        .catch(() => undefined),
    ),
  );
}
