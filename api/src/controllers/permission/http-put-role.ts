import { Request, Response } from "express";
import { updateRole } from "../../models/permission/roles";
import { serverIssue } from "../../utils/constantes";

export default async function httpPutRole(req: Request, res: Response) {
  try {
    const { role, label, rank } = req.body;
    await updateRole(req.params.id, role, label, rank);
    return res.status(200).json({ message: "Mise à jour effectuée avec succès" });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
