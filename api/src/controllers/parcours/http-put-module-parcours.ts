import { type Request, type Response } from "express";
import fs from "fs";
import putModuleParcours from "../../models/parcours/putModuleParcours.ts";
import {
  deleteTempUploadedFile,
  getBase64ImageFromReq,
} from "../../middleware/fileUpload.ts";
import sharp from "sharp";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

/**
 * Gère la mise à jour d'un module dans un parcours, y compris le traitement des images
 * @param req - Requête Express personnalisée contenant les données du module et potentiellement un fichier image
 * @param res - Réponse Express
 */
async function httpPutModuleParcours(req: CustomRequest, res: Response) {
  // Extraction des données de la requête
  const module = req.body;
  const uploadedFile = req.file;
  const userId = req.auth?.userId;

  try {
    if (uploadedFile) {
      // Traitement de l'image si un fichier a été uploadé
      const data = await fs.promises.readFile(uploadedFile.path);
      const image = data.toString("base64"); // Conversion de l'image en base64

      // Création d'une miniature redimensionnée
      const resizedPic = sharp(uploadedFile.path).resize(400, 400);
      const thumb = resizedPic.toBuffer();
      const thumb64 = (await thumb).toString("base64");

      // Mise à jour du module avec les images
      const response = await putModuleParcours(module, thumb64, image, userId!);
      await deleteTempUploadedFile(req); // Nettoyage du fichier temporaire

      return res
        .status(201)
        .json({ message: "Mise à jour réussie", data: response });
    } else {
      // Mise à jour du module sans image
      const response = await putModuleParcours(module, null, null, userId!);
      return res
        .status(201)
        .json({ message: "Mise à jour réussie", data: response });
    }
  } catch (error: any) {
    // Gestion des erreurs
    if (uploadedFile) await deleteTempUploadedFile(req); // Nettoyage en cas d'erreur
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export default httpPutModuleParcours;
