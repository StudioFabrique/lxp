import { type Request, type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import editUsers from "../../models/group/edit-users.ts";
import type { IUser } from "../../utils/interfaces/db/user.ts";

export default async function httpPutGroupUsers(req: Request, res: Response) {
  const { id: groupId } = req.params;

  const { users }: { users: IUser[] } = req.body;

  try {
    const groupUpdated = await editUsers(groupId, users);

    return res.status(201).json({
      message: "Utilisateurs du groupe mis à jour",
      data: groupUpdated,
    });
  } catch (error) {
    return res.status(500).json({ message: serverIssue });
  }
}
