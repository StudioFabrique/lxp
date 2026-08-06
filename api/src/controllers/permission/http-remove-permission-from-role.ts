import { type Request, type Response } from "express";
import { revokePermission } from "../../models/permission/roles.ts";
import { serverIssue } from "../../utils/constantes.ts";

export default async function httpRemovePermissionFromRole(req: Request, res: Response) {
  try {
    await revokePermission(req.params.roleId, req.params.permission);
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
