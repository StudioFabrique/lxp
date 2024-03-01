import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import editUsers from "../../models/group/edit-users";
import { IUser } from "../../utils/interfaces/db/user";

export default async function httpPutGroupUsers(req: Request, res: Response) {
  const { id: groupId } = req.params;

  const { users }: { users: IUser[] } = req.body;

  try {
    const groupUpdated = editUsers(groupId, users);

    return res
      .status(201)
      .json({
        message: "Utilisateurs du groupe mis à jour",
        data: groupUpdated,
      });
  } catch (error) {
    return res.status(500).json({ message: serverIssue });
  }
}
