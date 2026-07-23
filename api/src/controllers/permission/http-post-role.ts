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
      throw new Error("Erreur lors de la création du rôle");
    }

    const adminRole = await Role.findOne({ role: "admin" });

    const permissions = await Promise.all(
      ["read", "write", "update", "delete"].map(
        async (action) =>
          await Permission.create({
            name: `${action}:${createdRole.role}`,
            isRole: true,
          }),
      ),
    );

    if (adminRole) {
      await Role.findByIdAndUpdate(
        adminRole._id,
        {
          $addToSet: {
            permissions: { $each: permissions.map((p) => p._id) },
          },
        },
        { new: true },
      );
    }

    return res.status(201).send({ message: "Rôle créé avec succès" });
  } catch (error: any) {
    console.log(error);

    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
