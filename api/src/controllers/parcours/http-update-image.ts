import { Request, Response } from "express";
import { validationResult } from "express-validator";
import fs from "fs";

import { badQuery } from "../../utils/constantes";
import updateImage from "../../models/parcours/update-image";

async function httpUpdateImage(req: Request, res: Response) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: badQuery });
    }

    const uploadedFile = req.file;

    if (uploadedFile !== undefined) {
      // Faites ce que vous voulez avec le fichier, par exemple, lisez son nom, sa taille, son type, etc.
      console.log("Nom du fichier :", uploadedFile.originalname);
      console.log("Type MIME :", uploadedFile.mimetype);
      console.log("Taille du fichier :", uploadedFile.size);

      // Utilisez fs.promises.readFile avec async/await pour lire le fichier
      try {
        if (testFile(uploadedFile)) {
          const data = await fs.promises.readFile(uploadedFile.path);
          // Convertir le contenu du fichier en base64
          const base64String = data.toString("base64");

          // Faites ce que vous voulez avec la représentation base64 du fichier
          console.log("Fichier en base64 :", base64String);
          await fs.promises.unlink(uploadedFile.path);
          console.log("Fichier supprimé :", uploadedFile.path);
        }
      } catch (err) {
        return res
          .status(500)
          .json({ error: "Erreur lors de la lecture du fichier." });
      }
    }

    return res.status(201).json({ message: "Mise à jour réussie" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpUpdateImage;

function testFile(selectedFile: any) {
  const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;

  if (!allowedExtensions.test(selectedFile.name)) {
    return false; // Extension de fichier non autorisée
  }

  if (!selectedFile.type.startsWith("image/")) {
    return false; // Le fichier n'est pas une image
  }

  if (selectedFile.size > 1024 * 1024) {
    return false; // Fichier trop volumineux
  }
  return true;
}
