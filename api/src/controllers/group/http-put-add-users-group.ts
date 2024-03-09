import { Request, Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import addUsers from "../../models/group/add-users";

export default async function httpPutAddUsersGroup(
  req: Request,
  res: Response
) {
  const { id } = req.params;
  const { usersId }: { usersId: string[] } = req.body;

  try {
    const response = await addUsers(id, usersId);

    if (!response) {
      return res.status(400).json({ message: badQuery });
    }

    return res.status(200).json({ data: response });
  } catch (err) {
    return res.status(500).json({ message: serverIssue + err });
  }
}
