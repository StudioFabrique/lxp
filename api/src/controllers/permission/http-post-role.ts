import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import Role from "../../utils/interfaces/db/role";
import createPermission from "../../models/permission/create-permission";
import { createOrUpdateRoleWithPermissions } from "../../utils/rbac/rbac-utils";

export default async function httpPostRole(req: Request, res: Response) {
  try {
    const {
      role,
      label,
      rank,
    }: { role: string; label: string; rank: number; isActive: boolean } =
      req.body;

    // const createdRole = await createOrUpdateRoleWithPermissions(
    //   role,
    //   label,
    //   rank,
    // );

    // if (!createdRole) {
    //   return res.status(400).json({ message: "Le rôle existe déjà" });
    // }

    // const adminsRoles = await Role.find({ rank: 1 });

    // await Promise.all(
    //   ["read", "write", "update", "delete"].map(async (action) => {
    //     await createPermission(
    //       createdRole.role,
    //       rank,
    //       action as "read" | "write" | "update" | "delete",
    //       adminsRoles,
    //     );
    //   }),
    // );

    // const response = await getRole(createdRole.role);

    // return res
    //   .status(201)
    //   .send({ message: "Rôle créé avec succès", data: response });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
