import { type Request, type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import deleteTag from "../../models/tag/delete-tag.ts";

export default async function httpDeleteTag(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteTag(+id);
    return res
      .status(201)
      .json({ message: "Le tag a été supprimé avec succès" });
  } catch (error: any) {

    return res.status(500).json({ message: serverIssue });
  }
}
