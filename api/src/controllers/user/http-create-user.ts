import { Request, Response } from "express";
import {
  alreadyExist,
  badQuery,
  creationSuccessfull,
} from "../../utils/constantes";
import createUser from "../../models/user/create-user";
import { serverIssue } from "../../utils/constantes";
import bcrypt from "bcrypt";
import Role from "../../utils/interfaces/db/role";
import { IUser } from "../../utils/interfaces/db/user.model";

export default async function httpCreateUser(req: Request, res: Response) {
  const user: IUser = req.body;

  if (!user.password) {
    return res.status(400).json({ message: badQuery });
  }

  const salt = await bcrypt.genSalt(10);
  const pswHash = await bcrypt.hash(user.password, salt);
  user.password = pswHash;
  user.roles = [new Object((await Role.findOne({ role: "student" }))!._id)];

  try {
    const response = await createUser(user);
    if (response) {
      return res.status(201).json({ message: creationSuccessfull });
    }

    res.status(409).json({ message: alreadyExist });
    return;
  } catch (e) {
    res.status(500).json({ message: serverIssue + e });
  }
}
