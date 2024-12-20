import { Request, Response } from "express";
import Permission from "../../utils/interfaces/db/permission";
import Role, { IRole } from "../../utils/interfaces/db/role";
import { serverIssue } from "../../utils/constantes";

/**
 * Supprime un rôle ainsi que toutes ses permissions
 */
export default async function httpDeleteManyRoles(req: Request, res: Response) {
  try {
    const rolesIds: string[] = req.query.ids?.toString().split(",") || [];

    const roles: IRole[] = res.locals.roles; // récupérer le rôle défini dans le middleware précédent

    // empêcher un utilisateur de supprimer son propre rôle
    for (const role of roles) {
      if (rolesIds.includes(role._id.toString())) {
        return res
          .status(400)
          .json({ message: "Impossible de supprimer ses propres rôles" });
      }
    }

    await Permission.updateMany(
      { roles: { $in: rolesIds } },
      { $pull: { roles: { $in: rolesIds } } },
    );

    await Role.deleteMany({ _id: { $in: rolesIds } });

    return res
      .status(200)
      .json({ message: "suppression effectuée avec succès" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
