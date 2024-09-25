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
import editUsers from "../../models/group/edit-users";
import { IUser } from "../../utils/interfaces/db/user";

export default async function httpPutGroup(req: Request, res: Response) {
  const { id } = req.params;

  const uploadedFile = req.file;

  const {
    group,
    users,
  }: {
    group: IGroup;
    users: IUser[];
  } = req.body.data;

  let image: any;

  try {
    if (!!uploadedFile) {
      image = await fs.promises.readFile(uploadedFile.path);
    }
    const response = await putGroup(id, group, users, image);

    await deleteTempUploadedFile(req);
    return res.status(201).json({ message: creationSuccessfull });
  } catch (e) {
    console.log(e);

    await deleteTempUploadedFile(req);
    return res.status(500).json({ message: serverIssue + e });
  }
}
