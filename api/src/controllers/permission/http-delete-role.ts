import { Request, Response } from "express";
import Permission from "../../utils/interfaces/db/permission";
import Role, { IRole } from "../../utils/interfaces/db/role";
import { serverIssue } from "../../utils/constantes";
import mongoose from "mongoose";

/**
 * Supprime un rôle ainsi que toutes ses permissions
 */
export default async function httpDeleteRole(req: Request, res: Response) {
  try {
    const id: string = req.params.roleId;

    const roles: IRole[] = res.locals.roles; // récupérer le rôle défini dans le middleware précédent

    // empêcher un utilisateur de supprimer son propre rôle
    for (const role of roles) {
      if (role._id.toString() === id)
        return res
          .status(400)
          .json({ message: "Impossible de supprimer ses propres rôle" });
    }

    // vérifier si le rôle est protégé
    const roleToDelete = await Role.findById(id);

    if (!roleToDelete)
      return res
        .status(404)
        .json({ message: "Le rôle demandé pour la suppression n'existe pas" });

    if (roleToDelete.protection >= 1)
      return res
        .status(400)
        .json({ message: "Impossible de supprimer un rôle protégé" });

    // vérifier si le rôle est associé à 1 ou plus d'un utilisateur
    const usersWithRole = await Role.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
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

    const rolePermissionNames = [
      `write:${roleToDelete.role}`,
      `read:${roleToDelete.role}`,
      `delete:${roleToDelete.role}`,
      `update:${roleToDelete.role}`,
    ];
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

    await Role.deleteOne({ _id: id });

    return res
      .status(200)
      .json({ message: "Le rôle a été supprimé avec succès" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
