import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import deleteTag from "../../models/tag/delete-tag";

export default async function httpDeleteTag(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteTag(+id);
    return res
      .status(201)
      .json({ message: "Le tag a été supprimé avec succès" });
  } catch (error: any) {
    console.log({ error });

    return res.status(500).json({ message: serverIssue });
  }
}
