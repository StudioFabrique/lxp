import { Response } from "express";
import postModule from "../../models/formation/post-module";
import fs from "fs";
import { deleteTempUploadedFile } from "../../middleware/fileUpload";
import sharp from "sharp";
import CustomRequest from "../../utils/interfaces/express/custom-request";

async function httpPostModule(req: CustomRequest, res: Response) {
  const { module } = req.body;
  const uploadedFile = req.file;

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
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export default httpPostModule;
