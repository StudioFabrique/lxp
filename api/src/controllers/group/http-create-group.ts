import { Request, Response } from "express";
import { IGroup } from "../../utils/interfaces/db/group";
import createGroup from "../../models/group/create-group";
import {
  alreadyExist,
  creationSuccessfull,
  serverIssue,
} from "../../utils/constantes";

export default async function httpCreateGroup(req: Request, res: Response) {
  const group: IGroup = req.body.group;
  try {
    group.roles = { role: "user", label: "user", rank: 3 };
    const response = await createGroup(group);
    if (response) {
      return res.status(201).json({ message: creationSuccessfull });
    }
    return res.status(409).json({ message: alreadyExist });
  } catch (e) {
    return res.status(500).json({ message: serverIssue + e });
  }
}
