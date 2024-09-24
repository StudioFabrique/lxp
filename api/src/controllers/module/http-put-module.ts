import { Request, Response } from "express";
import fs from "fs";
import sharp from "sharp";

import putModule from "../../models/module/putModule";
import { deleteTempUploadedFile } from "../../middleware/fileUpload";

async function httpPutModule(req: Request, res: Response) {
  const module = JSON.parse(req.body.module);
  const uploadedFile: any = req.file;

  let thumb64: any;
  let image: any;

  try {
    if (uploadedFile) {
      const data = await fs.promises.readFile(uploadedFile.path);
      image = data.toString("base64");
      const resizedPic = sharp(uploadedFile.path).resize(400, 400);
      const thumb = resizedPic.toBuffer();
      thumb64 = (await thumb).toString("base64");

      const response = await putModule(module, thumb64, image);
      //console.log({ response });

      await deleteTempUploadedFile(req);

      return res
        .status(201)
        .json({ message: "Mise à jour réussie", data: response });
    } else {
      const response = await putModule(module, null, null);
      return res
        .status(201)
        .json({ message: "Mise à jour réussie", data: response });
    }
  } catch (error: any) {
    if (uploadedFile) await deleteTempUploadedFile(req);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export default httpPutModule;
