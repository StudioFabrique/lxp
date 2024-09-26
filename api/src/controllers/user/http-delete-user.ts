import { Request, Response } from "express";
import { badQuery, creationSuccessfull } from "../../utils/constantes";
import { serverIssue } from "../../utils/constantes";
import deleteUser from "../../models/user/delete-user";

export default async function httpDeleteUser(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    await deleteUser(id);

    return res.status(201).json({ message: creationSuccessfull });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ message: serverIssue + e });
  }
}
