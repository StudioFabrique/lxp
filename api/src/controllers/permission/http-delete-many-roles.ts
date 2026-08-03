import { type Request, type Response } from "express";
import { deleteManyRoles } from "../../models/permission/roles.ts";
import type { IRole } from "../../utils/interfaces/db/role.ts";
import { serverIssue } from "../../utils/constantes.ts";

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
