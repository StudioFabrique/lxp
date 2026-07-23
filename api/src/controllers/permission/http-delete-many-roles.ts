import { Request, Response } from "express";
import Permission from "../../utils/interfaces/db/permission";
import Role, { IRole } from "../../utils/interfaces/db/role";
import { serverIssue } from "../../utils/constantes";
import mongoose from "mongoose";

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

    // Check for protected roles
    const protectedRoles = await Role.find({
      _id: { $in: rolesIds },
      protection: { $in: [1, 2] },
    });

    if (protectedRoles.length > 0) {
      return res
        .status(400)
        .json({ message: "Impossible de supprimer des rôles protégés" });
    }

    // vérifier si les rôles sont associés à 1 ou plus d'un utilisateur
    const usersWithRole = await Role.aggregate([
      {
        $match: {
          _id: { $in: rolesIds.map((id) => new mongoose.Types.ObjectId(id)) },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "roles",
          as: "usersWithRole",
        },
      },
    ]);

    if (usersWithRole[0]?.usersWithRole?.length > 0) {
      return res.status(400).json({
        message:
          "Impossible de supprimer un rôle associé à plus d'un utilisateur",
      });
    }

    const rolePermissionNames = roles
      .map((role) => [
        `write:${role.role}`,
        `read:${role.role}`,
        `delete:${role.role}`,
        `update:${role.role}`,
      ])
      .flat();
    const permissionsToRemove = await Permission.find({
      name: { $in: rolePermissionNames },
    }).select("_id");

    await Role.updateMany(
      { role: { $not: /^interface:/ } },
      {
        $pull: { permissions: { $in: permissionsToRemove.map((p) => p._id) } },
      },
    );
    await Permission.deleteMany({ name: { $in: rolePermissionNames } });

    await Role.deleteMany({ _id: { $in: rolesIds } });

    return res
      .status(200)
      .json({ message: "suppression effectuée avec succès" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
