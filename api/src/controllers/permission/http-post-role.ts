import { Request, Response } from "express";
import { postRole } from "../../models/role/post-role";
import getRole from "../../models/role/get-role";

export default async function httpPostRole(req: Request, res: Response) {
  try {
    const { role, rank }: { role: string; rank: number } = req.body;

    if (role.substring(role.length - 5) === "_copy")
      return res
        .status(400)
        .json({ message: "Veuillez modifier le nom du role d'abord" });

    const createdRole = await postRole(role, rank);

    if (!createdRole) {
      return res.status(400).json({ message: "problème requête" });
    }

    const response = await getRole(createdRole.role);

    return res
      .status(201)
      .send({ message: "rôle créé avec succès", data: response });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Problème serveur" });
  }
}
