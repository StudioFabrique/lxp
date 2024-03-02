import { Request, Response } from "express";
import deleteGroup from "../../models/group/delete-group";
import { serverIssue } from "../../utils/constantes";

export default async function httpDeleteGroup(req: Request, res: Response) {
  const { id: groupId } = req.params;

  try {
    await deleteGroup(groupId);

    return res.status(201).json({
      message: "Groupe supprimé",
    });
  } catch (error) {
    return res.status(500).json({ message: serverIssue });
  }
}
