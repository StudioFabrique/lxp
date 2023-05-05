import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { IUser } from "../../utils/interfaces/db/teacher-admin/teacher.model";
import {
  alreadyExist,
  badQuery,
  creationSuccessfull,
} from "../../utils/constantes";
import make from "../../models/userTest/make";
import { serverIssue } from "../../utils/constantes";

export default async function makeUser(req: Request, res: Response) {
  console.log("la verification s'est passé sans problème");

  const checkValues = validationResult(req);

  if (!checkValues.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  const user: IUser = req.body;

  try {
    const response = await make(user);
    if (response) {
      return res.status(201).json({ message: creationSuccessfull });
    }

    res.status(409).json({ message: alreadyExist });
    return;
  } catch (e) {
    res.status(500).json({ message: serverIssue + e });
  }
}
