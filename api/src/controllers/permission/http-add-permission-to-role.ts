import { type Request, type Response } from "express";
import { grantPermission } from "../../models/permission/roles.ts";
import { serverIssue } from "../../utils/constantes.ts";

export default async function httpAddPermissionToRole(req: Request, res: Response) {
  try {
    await grantPermission(req.params.roleId, req.params.permission);
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
