import { type Request, type Response } from "express";

import { serverIssue } from "../../utils/constantes.ts";
import deleteManyGroups from "../../models/group/delete-many-groups.ts";

export default async function httpDeleteManyGroups(
  req: Request,
  res: Response,
) {
  const groupsIds = req.query.ids?.toString().split(",") || [];

  try {
    await deleteManyGroups(groupsIds);

    return res.status(201).json({
      message: "Groupe supprimé",
    });
  } catch (error) {
    return res.status(500).json({ message: serverIssue });
  }
}
