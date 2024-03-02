import { Request, Response } from "express";
import deleteUserFromGroup from "../../models/group/delete-user-from-group";
import { serverIssue } from "../../utils/constantes";

export default async function httpDeleteUserFromGroup(
  req: Request,
  res: Response
) {
  const { groupId, userId } = req.params;

  try {
    await deleteUserFromGroup(groupId, userId);

    return res.status(201).json({
      message: "Groupe supprimé",
    });
  } catch (error) {
    return res.status(500).json({ message: serverIssue });
  }
}
