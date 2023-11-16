import { Request, Response } from "express";
import postModule from "../../models/formation/post-module";
import fs from "fs";
import { deleteTempUploadedFile } from "../../middleware/fileUpload";
import sharp from "sharp";

async function httpPostModule(req: Request, res: Response) {
  const { module } = req.body;
  const uploadedFile = req.file;

  try {
    if (uploadedFile) {
      const data = await fs.promises.readFile(uploadedFile.path);
      const image = data.toString("base64");
      const resizedPic = sharp(uploadedFile.path).resize(400, 400);
      const thumb = resizedPic.toBuffer();
      const thumb64 = (await thumb).toString("base64");
      const response = await postModule(module, thumb64, image);
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
