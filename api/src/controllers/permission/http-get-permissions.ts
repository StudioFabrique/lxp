import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import { getAllActionsPermissionsForRole } from "../../utils/rbac/rbac-utils";

export default async function httpGetPermissions(req: Request, res: Response) {
  try {
    const role: string = req.params.role;

    const permissions = await getAllActionsPermissionsForRole(role);

    if (!permissions) {
      return res
        .status(404)
        .json({ message: "aucune permissions n'a été trouvé" });
    }

    return res.status(200).json({ data: permissions });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
