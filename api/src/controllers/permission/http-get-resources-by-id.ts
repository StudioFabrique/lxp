import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import Role from "../../utils/interfaces/db/role";
import { resourcesRbac } from "../../config/ressources-rbac";
import { getAllActionsPermissionsForRole } from "../../utils/rbac/rbac-utils";

export default async function httpGetResourcesById(
  req: Request,
  res: Response,
) {
  try {
    const id: string = req.params.id;

    const role = await Role.findById(id);

    const permissions = await getAllActionsPermissionsForRole({
      identifier: "_id",
      _id: id,
    });

    if (!permissions) {
      return res
        .status(404)
        .json({ message: "aucune permissions n'a été trouvé" });
    }

    const roles = await Role.find({
      role: { $not: { $regex: "^interface:" } },
    });

    const ressources = {
      ressources: resourcesRbac,
      roles: roles.map((role) => role.role),
    };

    if (!ressources || ressources.ressources.length <= 0) {
      return res
        .status(404)
        .json({ message: "aucune ressources n'a été trouvé" });
    }

    return res.status(200).json({ data: { permissions, ressources, role } });
  } catch (error) {
    console.error({ error });

    return res.status(500).json({ message: serverIssue });
  }
}
