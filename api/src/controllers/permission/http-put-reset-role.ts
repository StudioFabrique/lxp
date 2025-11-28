import { Request, Response } from "express";
import { serverIssue, badQuery } from "../../utils/constantes";
import { createOrUpdateRoleWithPermissions } from "../../utils/rbac/rbac-utils";
import Role from "../../utils/interfaces/db/role";
import { getPermissionsByRank } from "../../utils/rbac/config/ressources-rbac";

/**
 * Réinitialise toutes les permissions d'origine du rôle (utilise lorsque des permissions ont été ajoutées au système.)
 */
export default async function httpPutResetRole(req: Request, res: Response) {
  try {
    const idRole: string = req.params.id;

    const roleToFind = await Role.findById(idRole);

    if (!roleToFind) return res.status(400).json({ message: badQuery });

    await createOrUpdateRoleWithPermissions(
      roleToFind.role,
      roleToFind.label,
      roleToFind.rank,
      idRole,
      await getPermissionsByRank(roleToFind.rank),
      true
    );

    return res.status(200).json({
      message: "Mise à jour effectuée avec succès",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
