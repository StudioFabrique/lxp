import { Response } from "express";
import postModule from "../../models/formation/post-module";
import fs from "fs";
import { deleteTempUploadedFile } from "../../middleware/fileUpload";
import sharp from "sharp";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { validationResult } from "express-validator";
import { serverIssue } from "../../utils/constantes";

async function httpPostModule(req: CustomRequest, res: Response) {
  const module = req.body.module;

  const uploadedFile = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await deleteTempUploadedFile(req);
    return res.status(400).json({ message: "Requête non valide." });
  }

  try {
    const userId = req.auth?.userId;
    if (uploadedFile && userId) {
      const data = await fs.promises.readFile(uploadedFile.path);
      const image = data.toString("base64");
      const resizedPic = sharp(uploadedFile.path).resize(400, 400);
      const thumb = resizedPic.toBuffer();
      const thumb64 = (await thumb).toString("base64");
      const response = await postModule(module, thumb64, image, userId);
      await deleteTempUploadedFile(req);
      return res
        .status(201)
        .json({ message: "Mise à jour réussie", data: response });
    }
  } catch (error: any) {
    await deleteTempUploadedFile(req);
    console.log(error.message);

    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPostModule;
