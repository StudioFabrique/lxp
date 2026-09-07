import { type Response } from "express";
import {
  getActorRank,
  listRolePermissions,
} from "../../models/permission/roles.ts";
import { serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpGetPermissions(
  req: CustomRequest,
  res: Response,
) {
  try {
    const permissions = await listRolePermissions(
      req.params.role,
      getActorRank(req.auth!.userRoles),
    );
    if (!permissions) {
      return res
        .status(404)
        .json({ message: "aucune permissions n'a été trouvé" });
    }
    return res.status(200).json({ data: permissions });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
