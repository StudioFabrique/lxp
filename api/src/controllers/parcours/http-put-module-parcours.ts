import { Request, Response } from "express";
import fs from "fs";
import putModuleParcours from "../../models/parcours/putModuleParcours";
import {
  deleteTempUploadedFile,
  getBase64ImageFromReq,
} from "../../middleware/fileUpload";
import sharp from "sharp";
import CustomRequest from "../../utils/interfaces/express/custom-request";

async function httpPutModuleParcours(req: CustomRequest, res: Response) {
  const { module } = req.body;
  const uploadedFile = req.file;
  const userId = req.auth?.userId;

  try {
    if (uploadedFile) {
      const data = await fs.promises.readFile(uploadedFile.path);
      const image = data.toString("base64");
      const resizedPic = sharp(uploadedFile.path).resize(400, 400);
      const thumb = resizedPic.toBuffer();
      const thumb64 = (await thumb).toString("base64");
      const response = await putModuleParcours(module, thumb64, image, userId!);
      await deleteTempUploadedFile(req);
      return res
        .status(201)
        .json({ message: "Mise à jour réussie", data: response });
    } else {
      const response = await putModuleParcours(module, null, null, userId!);
      return res
        .status(201)
        .json({ message: "Mise à jour réussie", data: response });
    }
  } catch (error: any) {
    console.log({ error });
    if (uploadedFile) await deleteTempUploadedFile(req);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export default httpPutModuleParcours;
