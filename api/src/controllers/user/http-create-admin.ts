import { Request, Response } from "express";
import { IUser } from "../../utils/interfaces/db/teacher-admin/teacher.model";
import {
  alreadyExist,
  badQuery,
  creationSuccessfull,
} from "../../utils/constantes";
import createUser from "../../models/user/create-user";
import { serverIssue } from "../../utils/constantes";
import bcrypt from "bcrypt";

export default async function httpCreateAdmin(req: Request, res: Response) {
  const user: IUser = req.body;

  if (!user.password) {
    return res.status(400).json({ message: badQuery });
  }

  const salt = await bcrypt.genSalt(10);
  const pswHash = await bcrypt.hash(user.password, salt);

  user.password = pswHash;
  user.roles = { role: "admin", label: "admin", rank: 1 };

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
