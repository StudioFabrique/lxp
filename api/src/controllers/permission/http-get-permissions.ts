import { Request, Response } from "express";
import Permission from "../../utils/interfaces/db/permission";
import { serverIssue } from "../../utils/constantes";
import { ressourcesRbac } from "../../config/ressources-rbac";
import Role from "../../utils/interfaces/db/role";

export default async function httpGetPermissions(req: Request, res: Response) {
  try {
    const role: string = req.params.role;

    const permissions = await Permission.find({ role });

    if (!permissions) {
      return res
        .status(404)
        .json({ message: "aucune permissions n'a été trouvé" });
    }

    const roles = await Role.find();

    const ressources = {
      ressources: ressourcesRbac,
      roles: roles.map((role) => role.role),
    };

    if (!ressources || ressources.ressources.length <= 0) {
      return res
        .status(404)
        .json({ message: "aucune ressources n'a été trouvé" });
    }

    console.log(permissions);

    return res.status(200).json({ data: { permissions, ressources } });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
