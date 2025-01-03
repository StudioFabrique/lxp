import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import { addPermissionToRole } from "../../utils/rbac/rbac-utils";

export default async function httpAddPermissionToRole(
  req: Request,
  res: Response,
) {
  try {
    const { roleId, permission } = req.params;

    await addPermissionToRole(roleId, permission);

    res.status(200).json({
      success: true,
      message: "Permission successfully added to role",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
