import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import deleteManyTags from "../../models/tag/delete-many-tags";

export default async function httpDeleteManyTags(req: Request, res: Response) {
  const tagsIds = req.query.ids?.toString().split(",") || [];

  try {
    await deleteManyTags(tagsIds);

    return res.status(201).json({
      message: "Tags supprimés",
    });
  } catch (error) {
    return res.status(500).json({ message: serverIssue });
  }
}
