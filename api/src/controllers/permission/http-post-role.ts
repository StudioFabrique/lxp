import { Request, Response } from "express";
import { postRole } from "../../models/role/post-role";
import getRole from "../../models/role/get-role";
import { serverIssue } from "../../utils/constantes";
import Permission from "../../utils/interfaces/db/permission";
import Role from "../../utils/interfaces/db/role";
import CreatePermission from "../../models/permission/create-permission";

export default async function httpPostRole(req: Request, res: Response) {
  try {
    const {
      role,
      label,
      rank,
      isActive,
    }: { role: string; label: string; rank: number; isActive: boolean } =
      req.body;

    console.log({ label });

    /* if (role.substring(role.length - 6) === "_clone")
      return res
        .status(400)
        .json({ message: "Veuillez modifier le nom du role d'abord" }); */

    const createdRole = await postRole(role, label, rank, isActive);

    if (!createdRole) {
      return res.status(400).json({ message: "Le rôle existe déjà" });
    }

    for (const action of ["read", "write", "update", "delete"])
      await CreatePermission(createdRole.role, rank, action);

    /* await Permission.create({
      role: createdRole.role,
      action: "write",
      ressources: async () => {
        switch (rank) {
          case 1:
            return [
              ...ressourcesRbac1,
              ...(await Role.find()).map((role) => role.role),
            ];
          case 2:
            [];
          default:
            return [];
        }
      },
    });

    await Permission.create({
      role: createdRole.role,
      action: "read",
      ressources: async () => {
        switch (rank) {
          case 1:
            return [
              ...ressourcesRbac1,
              ...(await Role.find()).map((role) => role.role),
            ];
          default:
            return [];
        }
      },
    });

    await Permission.create({
      role: createdRole.role,
      action: "update",
      ressources: async () => {
        switch (rank) {
          case 1:
            return [
              ...ressourcesRbac1,
              ...(await Role.find()).map((role) => role.role),
            ];
          default:
            return [];
        }
      },
    });

    await Permission.create({
      role: createdRole.role,
      action: "delete",
      ressources: async () => {
        switch (rank) {
          case 1:
            return [
              ...ressourcesRbac1,
              ...(await Role.find()).map((role) => role.role),
            ];
          default:
            return [];
        }
      },
    }); */

    const response = await getRole(createdRole.role);

    return res
      .status(201)
      .send({ message: "Rôle créé avec succès", data: response });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
