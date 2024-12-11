import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import Role from "../../utils/interfaces/db/role";
import { ressourcesRbac } from "../../config/ressources-rbac";
import Permission from "../../utils/interfaces/db/permission";
import { getAllActionsPermissionsForRole } from "../../utils/rbac/rbac-utils";

export default async function httpGetRessources(req: Request, res: Response) {
  try {
    const role: string = req.params.role;

    const permissions = await getAllActionsPermissionsForRole(role);

    if (!permissions) {
      return res
        .status(404)
        .json({ message: "aucune permissions n'a été trouvé" });
    }

    const roles = await Role.find({
      role: { $not: { $regex: "^interface:" } },
    });

    const ressources = {
      ressources: ressourcesRbac,
      roles: roles.map((role) => role.role),
    };

    if (!ressources || ressources.ressources.length <= 0) {
      return res
        .status(404)
        .json({ message: "aucune ressources n'a été trouvé" });
    }

    return res.status(200).json({ data: { permissions, ressources } });
  } catch (error) {
    console.error({ error });

    return res.status(500).json({ message: serverIssue });
  }
}
