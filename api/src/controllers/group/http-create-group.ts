import { type Request, type Response } from "express";
import type { IGroup } from "../../utils/interfaces/db/group.ts";
import createGroup from "../../models/group/create-group.ts";
import {
  alreadyExist,
  creationSuccessfull,
  serverIssue,
} from "../../utils/constantes.ts";
import { deleteTempUploadedFile } from "../../middleware/fileUpload.ts";
import fs from "fs";
import type { IUser } from "../../utils/interfaces/db/user.ts";

export default async function httpCreateGroup(req: Request, res: Response) {
  const uploadedFile = req.file;

  const {
    group,
    users,
    parcoursId,
  }: {
    group: IGroup;
    users: IUser[];
    parcoursId?: number;
  } = req.body.data;

  let image: any;

  try {
    if (!!uploadedFile) {
      image = await fs.promises.readFile(uploadedFile.path);
    }
    const response = await createGroup(group, users, image, parcoursId);

    await deleteTempUploadedFile(req);
    if (response) {
      return res.status(201).json({ message: creationSuccessfull });
    }
    return res.status(409).json({ message: alreadyExist });
  } catch (e) {
    console.log(e);

    await deleteTempUploadedFile(req);
    return res.status(500).json({ message: serverIssue + e });
  }
}
