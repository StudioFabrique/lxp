import { Request, Response } from "express";
import { IGroup } from "../../utils/interfaces/db/group";
import createGroup from "../../models/group/create-group";
import {
  alreadyExist,
  creationSuccessfull,
  serverIssue,
} from "../../utils/constantes";
import Role from "../../utils/interfaces/db/role";

export default async function httpCreateGroup(req: Request, res: Response) {
  console.log(req.body);

  const group: IGroup = req.body;
  try {
    group.roles = [new Object((await Role.findOne({ role: "admin" }))!._id)];
    /* group.teachers = [];
    group.users = []; */
    console.log("roles " + group.roles);
    const response = await createGroup(group);
    if (response) {
      return res.status(201).json({ message: creationSuccessfull });
    }
    return res.status(409).json({ message: alreadyExist });
  } catch (e) {
    return res.status(500).json({ message: serverIssue + e });
  }
}
