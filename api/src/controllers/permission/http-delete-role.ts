import { Request, Response } from "express";
import { deleteRole } from "../../models/permission/roles";
import type { IRole } from "../../utils/interfaces/db/role";
import { serverIssue } from "../../utils/constantes";

export default async function httpDeleteRole(req: Request, res: Response) {
  try {
    await deleteRole(req.params.roleId, res.locals.roles as IRole[]);
    return res.status(200).json({ message: "Le rôle a été supprimé avec succès" });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
