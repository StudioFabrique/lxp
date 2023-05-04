import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { IUser } from "../../utils/interfaces/db/teacher-admin/teacher.model";
import { badQuery } from "../../utils/constantes";

export default async function MakeUser(req: Request, res: Response) {
  const checkValues = validationResult(req);

  if (!checkValues.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  const {
    email,
    password,
    firstname,
    lastname,
    address,
    postCode,
    city,
  }: IUser = req.body;
}
