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

    const uploadedFile: any = req.file;
    const parcoursId = req.body.parcoursId;

    if (uploadedFile !== undefined) {
      try {
        {
          const data = await fs.promises.readFile(uploadedFile.path);
          const base64String = data.toString("base64");
          const response = await updateImage(
            parseInt(parcoursId),
            base64String
          );
          if (response) {
            await fs.promises.unlink(uploadedFile.path);
            console.log("Fichier supprimé :", uploadedFile.path);
            return res.status(201).json({ message: "Mise à jour réussie" });
          }
        }
      } catch (err) {
        return res
          .status(500)
          .json({ error: "Erreur lors de la lecture du fichier." });
      }
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpUpdateImage;
