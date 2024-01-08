import { Request, Response } from "express";
import { IGroup } from "../../utils/interfaces/db/group";
import createGroup from "../../models/group/create-group";
import {
  alreadyExist,
  creationSuccessfull,
  serverIssue,
} from "../../utils/constantes";
import { IUser } from "../../utils/interfaces/db/user";
import updateManyUsers from "../../models/user/update-many-users";
import {
  deleteTempUploadedFile,
  getBase64ImageFromReq,
} from "../../middleware/fileUpload";
import fs from "fs";

export default async function httpCreateGroup(req: Request, res: Response) {
  const uploadedFile = req.file;

  const {
    group,
    users,
    parcoursId,
  }: {
    group: IGroup;
    users: IUser[];
    parcoursId: number;
  } = req.body.data;

  let image: any;

  try {
    if (!!uploadedFile) {
      image = await fs.promises.readFile(uploadedFile.path);
    }
    const response = await createGroup(group, users, image, parcoursId);

    //console.log(response);

    const usersToUpdate = users.map((user) => {
      user.group?.push(response);
      return user;
    });

    await updateManyUsers(usersToUpdate);

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
