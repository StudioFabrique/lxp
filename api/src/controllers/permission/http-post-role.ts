import { Request, Response } from "express";
import { postRole } from "../../models/role/post-role";
import getRole from "../../models/role/get-role";
import { serverIssue } from "../../utils/constantes";
import Permission from "../../utils/interfaces/db/permission";

export default async function httpPostRole(req: Request, res: Response) {
  try {
    const {
      role,
      label,
      isActive,
    }: { role: string; label: string; isActive: boolean } = req.body;

    console.log({ label });

    /* if (role.substring(role.length - 6) === "_clone")
      return res
        .status(400)
        .json({ message: "Veuillez modifier le nom du role d'abord" }); */

    const createdRole = await postRole(role, label, isActive);

    if (!createdRole) {
      return res.status(400).json({ message: "Le rôle existe déjà" });
    }

    await Permission.create({
      role: createdRole.role,
      action: "write",
      ressources: [],
    });

    await Permission.create({
      role: createdRole.role,
      action: "read",
      ressources: [],
    });

    await Permission.create({
      role: createdRole.role,
      action: "update",
      ressources: [],
    });

    await Permission.create({
      role: createdRole.role,
      action: "delete",
      ressources: [],
    });

    const response = await getRole(createdRole.role);

    return res
      .status(201)
      .send({ message: "Rôle créé avec succès", data: response });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
