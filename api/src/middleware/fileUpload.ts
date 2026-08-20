import { type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import path from "path";
import * as fs from "fs";
import { serverIssue } from "../utils/constantes.ts";

/**
 * Extrait et convertit l'image du fichier uploadé en base64
 * @param req - La requête Express contenant le fichier
 * @returns Une promesse contenant la chaîne base64 de l'image
 */
export const getBase64ImageFromReq = async (req: Request): Promise<string> => {
  const image: any = req.file;
  const imageData = await fs.promises.readFile(image.path);
  const base64String = imageData.toString("base64");
  return base64String;
};

/**
 * Supprime le fichier temporaire uploadé
 * @param req - La requête Express contenant le fichier à supprimer
 */
export async function deleteTempUploadedFile(req: Request) {
  if (req.file) {
    await fs.promises.unlink(req.file.path);
  }
}

/**
 * Crée un middleware pour gérer l'upload de fichiers
 * @param maxFileSize - Taille maximale autorisée pour le fichier en octets
 * @returns Un middleware Express pour l'upload de fichiers
 */
export const createFileUploadMiddleware: any = (maxFileSize: number) => {
  // Configuration du stockage des fichiers uploadés
  const storage = multer.diskStorage({
    // Définit le dossier de destination
    destination: function (req, file, cb) {
      cb(null, path.join(import.meta.dirname, "..", "..", "uploads"));
    },
    // Génère un nom de fichier unique
    filename: function (req, file, cb) {
      if (file.mimetype.startsWith("image")) {
        const newFileName =
          Date.now() +
          "-" +
          Math.round(Math.random() * 1e9) +
          file.originalname;
        cb(null, file.fieldname + "-" + newFileName);
      } else {
        return;
      }
    },
  });

  // Retourne le middleware configuré
  return (req: Request, res: Response, next: NextFunction) => {
    // Configure multer avec le stockage et les limites définis
    const upload = multer({
      storage: storage,
      limits: { fileSize: maxFileSize },
    }).single("image");

    // Gère l'upload du fichier
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Erreur Multer lors de l'upload
        return res.status(400).json({
          message: "La taille du fichier dépasse la taille autorisée.",
        });
      } else if (err) {
        // Erreur inconnue
        return res.status(500).json({ message: err.message });
      }
      // Pas d'erreur, continue vers le prochain middleware
      next();
    });
  };
};
