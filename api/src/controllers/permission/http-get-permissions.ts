import { Request, Response } from "express";
import { listRolePermissions } from "../../models/permission/roles";
import { serverIssue } from "../../utils/constantes";

export default async function httpGetPermissions(req: Request, res: Response) {
  try {
    const permissions = await listRolePermissions(req.params.role);
    if (!permissions) {
      return res.status(404).json({ message: "aucune permissions n'a été trouvé" });
    }
    return res.status(200).json({ data: permissions });
  } catch {
    return res.status(500).json({ message: serverIssue });
  }
}
