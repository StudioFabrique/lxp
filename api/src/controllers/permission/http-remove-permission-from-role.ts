import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import { removePermissionFromRole } from "../../utils/rbac/rbac-utils";

export default async function httpRemovePermissionFromRole(
  req: Request,
  res: Response,
) {
  try {
    const { roleId, permission } = req.params;

    await removePermissionFromRole(roleId, permission);

    res.status(200).json({
      success: true,
      message: "Permission successfully removed from role",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
