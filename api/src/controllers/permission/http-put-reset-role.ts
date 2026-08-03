import { Request, Response } from "express";
import { resetRole } from "../../models/permission/roles";
import { serverIssue } from "../../utils/constantes";

export default async function httpPutResetRole(req: Request, res: Response) {
  try {
    await resetRole(req.params.id);
    return res.status(200).json({ message: "Mise à jour effectuée avec succès" });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
