import { type Response } from "express";
import {
  getActorRank,
  revokePermission,
} from "../../models/permission/roles.ts";
import { serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpRemovePermissionFromRole(
  req: CustomRequest,
  res: Response,
) {
  try {
    await revokePermission(
      req.params.roleId,
      req.params.permission,
      getActorRank(req.auth!.userRoles),
    );
    return res.status(200).json({
      success: true,
      message: "Permission successfully removed from role",
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
