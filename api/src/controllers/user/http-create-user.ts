import { Request, Response } from "express";
import {
  alreadyExist,
  badQuery,
  creationSuccessfull,
} from "../../utils/constantes";
import createUser from "../../models/user/create-user";
import { serverIssue } from "../../utils/constantes";
import bcrypt from "bcrypt";
import { IStudent } from "../../utils/interfaces/db/student/student.model";

export default async function httpCreateUser(req: Request, res: Response) {
  const user: IStudent = req.body;

  if (!user.password) {
    return res.status(400).json({ message: badQuery });
  }
  const psw = await bcrypt.hash(user.password, 10);
  user.password = psw;
  user.roles = { role: "user", label: "user", rank: 3 };

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
