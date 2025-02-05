import { Request, Response } from "express";
import fs from "fs";
import sharp from "sharp";

import putModule from "../../models/module/putModule";
import { deleteTempUploadedFile } from "../../middleware/fileUpload";

/**
 * Gère la mise à jour d'un module existant
 * Si une image est fournie, elle est redimensionnée et stockée en base64
 * @param req Requête Express contenant les données du module et éventuellement une image
 * @param res Réponse Express
 * @returns Réponse avec le module mis à jour ou message d'erreur
 */
async function httpPutModule(req: Request, res: Response) {
  // Récupération des données du module et du fichier uploadé

  const module = req.body.module;
  const uploadedFile: any = req.file;

  // Variables pour stocker l'image originale et la miniature en base64
  let thumb64: any;
  let image: any;

  try {
    if (uploadedFile) {
      // Si une image est fournie, on la traite
      const data = await fs.promises.readFile(uploadedFile.path);
      image = data.toString("base64");

      // Création d'une miniature redimensionnée à 400x400
      const resizedPic = sharp(uploadedFile.path).resize(400, 400);
      const thumb = resizedPic.toBuffer();
      thumb64 = (await thumb).toString("base64");

      // Mise à jour du module avec la nouvelle image
      const response = await putModule(module, thumb64, image);

      // Nettoyage du fichier temporaire
      await deleteTempUploadedFile(req);

      return res
        .status(201)
        .json({ message: "Mise à jour réussie", data: response });
    } else {
      // Si pas d'image, mise à jour simple du module
      const response = await putModule(module, null, null);
      return res
        .status(201)
        .json({ message: "Mise à jour réussie", data: response });
    }
  } catch (error: any) {
    // En cas d'erreur, on nettoie le fichier temporaire si existant
    if (uploadedFile) await deleteTempUploadedFile(req);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export default httpPutModule;
