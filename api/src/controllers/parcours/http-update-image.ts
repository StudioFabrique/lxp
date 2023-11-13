import { Request, Response } from "express";
import { validationResult } from "express-validator";
import fs from "fs";
import { badQuery, serverIssue } from "../../utils/constantes";
import updateImage from "../../models/parcours/update-image";
import { logger } from "../../utils/logs/logger";
import sharp from "sharp";

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

          const resizedPic = sharp(uploadedFile.path).resize(400, 400);
          const thumb = resizedPic.toBuffer();
          const thumb64 = (await thumb).toString("base64");

          const response = await updateImage(
            +parcoursId,
            base64String,
            thumb64
          );
          if (response) {
            console.log("response dans la place");

            await fs.promises.unlink(uploadedFile.path);
            console.log("Fichier supprimé :", uploadedFile.path);
            return res.status(200).json({ message: "Mise à jour réussie" });
          }
        }
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }
  } catch (error: any) {
    let returnedError = error;
    if (error.status === 403) {
      returnedError = { ...returnedError, from: req.socket.remoteAddress };
    }
    return res
      .status(returnedError.status ?? 500)
      .json({ message: returnedError.message ?? serverIssue });
  }
}

export default httpUpdateImage;
