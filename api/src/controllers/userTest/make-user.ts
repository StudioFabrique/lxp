import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { IUser } from "../../utils/interfaces/db/teacher-admin/teacher.model";
import {
  alreadyExist,
  badQuery,
  creationSuccessfull,
} from "../../utils/constantes";
import make from "../../models/userTest/make";

export default async function MakeUser(req: Request, res: Response) {
  const checkValues = validationResult(req);

  if (!checkValues.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  const user: IUser = req.body;

  make(user).then((response) =>
    response != null
      ? res.status(201).json({ message: creationSuccessfull })
      : res.status(409).json({ message: alreadyExist })
  );
}
