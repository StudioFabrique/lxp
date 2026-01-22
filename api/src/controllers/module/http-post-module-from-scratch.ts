import CustomRequest from "../../utils/interfaces/express/custom-request";
import { Response, NextFunction } from "express";
import fs from "fs";
import sharp from "sharp";
import postModuleFromScratch from "../../models/module/post-module-from-scratch";
import { deleteTempUploadedFile } from "../../middleware/fileUpload";

export default async function httpPostModuleFromScratch(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const module = req.body.module;
    const uploadedFile = req.file;

    const userId = req.auth?.userId;
    let response;
    if (uploadedFile) {
      const data = await fs.promises.readFile(uploadedFile.path);
      const image = data.toString("base64");
      const resizedPic = sharp(uploadedFile.path).resize(400, 400);
      const thumb = resizedPic.toBuffer();
      const thumb64 = (await thumb).toString("base64");
      response = await postModuleFromScratch(
        userId!,
        module.title,
        module.description,
        module.formationId,
        module.parcoursId,
        module.contactsIds,
        module.bonusSkillsIds,
        module.duration,
        image,
        thumb64,
      );
      await deleteTempUploadedFile(req);
    } else {
      response = await postModuleFromScratch(
        userId!,
        module.title,
        module.description,
        module.formationId,
        module.parcoursId,
        module.contactsIds,
        module.bonusSkillsIds,
        module.duration,
        null,
        null,
      );
    }
    next({
      statusCode: 201,
      data: response,
    });
  } catch (error: any) {
    next({ statusCode: error.statusCode ?? 500, message: error.message });
  }
}
