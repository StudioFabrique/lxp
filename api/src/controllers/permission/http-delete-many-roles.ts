import { Request, Response } from "express";
import { deleteManyRoles } from "../../models/permission/roles";
import type { IRole } from "../../utils/interfaces/db/role";
import { serverIssue } from "../../utils/constantes";

export default async function httpDeleteManyRoles(req: Request, res: Response) {
  try {
    const ids = req.query.ids?.toString().split(",") ?? [];
    await deleteManyRoles(ids, res.locals.roles as IRole[]);
    return res.status(200).json({ message: "suppression effectuée avec succès" });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
