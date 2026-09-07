import { type Response } from "express";
import {
  getActorRank,
  grantPermission,
} from "../../models/permission/roles.ts";
import { serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpAddPermissionToRole(
  req: CustomRequest,
  res: Response,
) {
  try {
    await grantPermission(
      req.params.roleId,
      req.params.permission,
      getActorRank(req.auth!.userRoles),
    );
    return res.status(200).json({
      success: true,
      message: "Permission successfully added to role",
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
