import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putTag from "../../models/tag/put-tag";

export default async function httpPutTag(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    await putTag(+id, name);
    return res
      .status(201)
      .json({ message: "Le tag a été modifié avec succès" });
  } catch (error: any) {
    return res.status(500).json({ message: serverIssue });
  }
}
