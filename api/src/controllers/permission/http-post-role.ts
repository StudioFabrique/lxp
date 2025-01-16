import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import { createOrUpdateRoleWithPermissions } from "../../utils/rbac/rbac-utils";
import { getPermissionsByRank } from "../../utils/rbac/config/ressources-rbac";
import Permission from "../../utils/interfaces/db/permission";
import Role from "../../utils/interfaces/db/role";

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

    const adminRole = await Role.findOne({ role: "admin" });

    const permissions = await Promise.all(
      ["read", "write", "update", "delete"].map(
        async (action) =>
          await Permission.create({
            name: `${action}:${createdRole.role}`,
            isRole: true,
            roles: [adminRole?._id],
          }),
      ),
    );

    await Role.findByIdAndUpdate(
      createdRole._id,
      { $push: { permissions: { $each: permissions.map((p) => p._id) } } },
      { new: true },
    );

    return res.status(201).send({ message: "Rôle créé avec succès" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
