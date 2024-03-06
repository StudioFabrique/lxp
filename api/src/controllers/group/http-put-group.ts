import { Request, Response } from "express";
import { IGroup } from "../../utils/interfaces/db/group";
import {
  alreadyExist,
  creationSuccessfull,
  serverIssue,
} from "../../utils/constantes";
import { deleteTempUploadedFile } from "../../middleware/fileUpload";
import fs from "fs";
import putGroup from "../../models/group/put-group";

export default async function httpPutGroup(req: Request, res: Response) {
  const uploadedFile = req.file;

  const {
    group,
  }: {
    group: IGroup;
  } = req.body.data;

  let image: any;

  try {
    if (!!uploadedFile) {
      image = await fs.promises.readFile(uploadedFile.path);
    }
    const response = await putGroup(group, image);

    await deleteTempUploadedFile(req);
    return res.status(201).json({ message: creationSuccessfull });
  } catch (e) {
    console.log(e);

    await deleteTempUploadedFile(req);
    return res.status(500).json({ message: serverIssue + e });
  }
}
