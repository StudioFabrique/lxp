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
import { getBase64ImageFromReq } from "../../middleware/fileUpload";

export default async function httpCreateGroup(req: Request, res: Response) {
  const body = JSON.parse(req.body.data);
  const image = await getBase64ImageFromReq(req);

  const {
    group,
    users,
    parcoursId,
  }: {
    group: IGroup;
    users: IUser[];
    parcoursId: number;
  } = body;

  try {
    const response = await createGroup(group, users, image, parcoursId);

    console.log(response);

    const usersToUpdate = users.map((user) => {
      user.group?.push(response);
      return user;
    });

    await updateManyUsers(usersToUpdate);

    if (response) {
      return res.status(201).json({ message: creationSuccessfull });
    }
    return res.status(409).json({ message: alreadyExist });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ message: serverIssue + e });
  }
}
