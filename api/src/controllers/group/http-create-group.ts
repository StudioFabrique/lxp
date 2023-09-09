import { Request, Response } from "express";
import { IGroup } from "../../utils/interfaces/db/group";
import createGroup from "../../models/group/create-group";
import {
  alreadyExist,
  creationSuccessfull,
  serverIssue,
} from "../../utils/constantes";
import { IUser } from "../../utils/interfaces/db/user";

export default async function httpCreateGroup(req: Request, res: Response) {
  const {
    groupRequest,
    users,
    formationId,
    parcoursId,
  }: {
    groupRequest: IGroup;
    users: IUser[];
    formationId: number;
    parcoursId: number;
  } = req.body;
  try {
    const response = await createGroup(
      groupRequest,
      users,
      parcoursId,
      formationId
    );

    console.log(response);

    if (response) {
      return res.status(201).json({ message: creationSuccessfull });
    }
    return res.status(409).json({ message: alreadyExist });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ message: serverIssue + e });
  }
}
