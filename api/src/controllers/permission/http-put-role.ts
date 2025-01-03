import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import { createOrUpdateRoleWithPermissions } from "../../utils/rbac/rbac-utils";
import Role from "../../utils/interfaces/db/role";
import { getPermissionsByRank } from "../../utils/rbac/config/ressources-rbac";

/**
 * Mets à jour le nom d'un rôle ainsi que toutes ses permissions
 */
export default async function httpPutRole(req: Request, res: Response) {
  try {
    const idRole: string = req.params.id;

    const {
      role,
      label,
      rank,
    }: {
      role: string;
      label: string;
      rank: number;
    } = req.body;

    const roleToFind = await Role.findById(idRole);
    if (roleToFind?.rank !== rank)
      await createOrUpdateRoleWithPermissions(
        role,
        label,
        rank,
        idRole,
        await getPermissionsByRank(rank),
      );
    else await createOrUpdateRoleWithPermissions(role, label, rank, idRole);

    return res.status(200).json({
      message: "Mise à jour effectuée avec succès",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
