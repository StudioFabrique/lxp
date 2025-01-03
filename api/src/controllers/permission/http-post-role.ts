import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import { createOrUpdateRoleWithPermissions } from "../../utils/rbac/rbac-utils";
import { getPermissionsByRank } from "../../utils/rbac/config/ressources-rbac";

export default async function httpPostRole(req: Request, res: Response) {
  try {
    const {
      role,
      label,
      rank,
    }: { role: string; label: string; rank: number; isActive: boolean } =
      req.body;

    const createdRole = await createOrUpdateRoleWithPermissions(
      role,
      label,
      rank,
      undefined,
      await getPermissionsByRank(rank),
    );

    if (!createdRole) {
      return res.status(400).json({ message: "Le rôle existe déjà" });
    }

    return res.status(201).send({ message: "Rôle créé avec succès" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
