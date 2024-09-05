import { Request, Response } from "express";
import { postRole } from "../../models/role/post-role";
import getRole from "../../models/role/get-role";
import { serverIssue } from "../../utils/constantes";
import CreatePermission from "../../models/permission/create-permission";
import Role from "../../utils/interfaces/db/role";

export default async function httpPostRole(req: Request, res: Response) {
  try {
    const {
      role,
      label,
      rank,
      isActive,
    }: { role: string; label: string; rank: number; isActive: boolean } =
      req.body;

    /* if (role.substring(role.length - 6) === "_clone")
      return res
        .status(400)
        .json({ message: "Veuillez modifier le nom du role d'abord" }); */

    const createdRole = await postRole(
      role.toLocaleLowerCase().trim(),
      label.toLocaleLowerCase().trim(),
      rank,
      isActive,
    );

    if (!createdRole) {
      return res.status(400).json({ message: "Le rôle existe déjà" });
    }

    const adminsRoles = await Role.find({ rank: 1 });

    await Promise.all(
      ["read", "write", "update", "delete"].map(async (action) => {
        await CreatePermission(
          createdRole.role,
          rank,
          action as "read" | "write" | "update" | "delete",
          adminsRoles,
        );
      }),
    );

    const response = await getRole(createdRole.role);

    return res
      .status(201)
      .send({ message: "Rôle créé avec succès", data: response });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
