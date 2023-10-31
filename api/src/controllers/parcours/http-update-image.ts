import { Response } from "express";
import { validationResult } from "express-validator";
import fs from "fs";
import { badQuery, noAccess, serverIssue } from "../../utils/constantes";
import updateImage from "../../models/parcours/update-image";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { logger } from "../../utils/logs/logger";
import sharp from "sharp";

async function httpUpdateImage(req: CustomRequest, res: Response) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      throw { message: noAccess, status: 403 };
    }
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: badQuery });
    }

    const uploadedFile: any = req.file;
    const parcoursId = req.body.parcoursId;

    console.log("file", req.file);

    if (uploadedFile !== undefined) {
      try {
        {
          const data = await fs.promises.readFile(uploadedFile.path);
          const base64String = data.toString("base64");

          const resizedPic = sharp(uploadedFile.path).resize(200, 200);
          const thumb = resizedPic.toBuffer();
          const thumb64 = (await thumb).toString("base64");

          const response = await updateImage(
            +parcoursId,
            base64String,
            thumb64,
            userId
          );
          if (response) {
            console.log("response dans la place");

            await fs.promises.unlink(uploadedFile.path);
            console.log("Fichier supprimé :", uploadedFile.path);
            return res.status(201).json({ message: "Mise à jour réussie" });
          }
        }
      } catch (error: any) {
        return res
          .status(500)
          .json({ error: "Erreur lors de la lecture du fichier." });
      }
    }
  } catch (error: any) {
    let returnedError = error;
    if (error.status === 403) {
      returnedError = { ...returnedError, from: req.socket.remoteAddress };
      logger.error(returnedError);
    }
    return res
      .status(returnedError.status ?? 500)
      .json({ message: returnedError.message ?? serverIssue });
  }
}

export default httpUpdateImage;
