import { Request, Response } from "express";
import Permission from "../../utils/interfaces/db/permission";
import Role, { IRole } from "../../utils/interfaces/db/role";

/**
 * Supprime un rôle ainsi que toutes ses permissions
 */
export default async function httpDeleteRole(req: Request, res: Response) {
  try {
    const roleToDelete: string = req.params.role;

    const roles: IRole[] = res.locals.roles; // récupérer le rôle défini dans le middleware précédent

    // empêcher un utilisateur de supprimer son propre rôle
    for (const role of roles) {
      if (role.role === roleToDelete)
        return res
          .status(400)
          .json({ message: "Impossible de supprimer son propre rôle" });
    }

    await Permission.deleteMany({ role: roleToDelete });

    await Role.deleteMany({ role: roleToDelete });

    return res
      .status(200)
      .json({ message: "suppression effectué avec succès" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Problème serveur" });
  }
}
