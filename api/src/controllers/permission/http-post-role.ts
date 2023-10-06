import { Request, Response } from "express";
import { postRole } from "../../models/role/post-role";

export default async function httpPostRole(req: Request, res: Response) {
  try {
    const { role, rank }: { role: string; rank: number } = req.body;

    const createdRole = await postRole(role, rank);

    return res
      .status(201)
      .send({ message: "rôle créé avec succès", data: createdRole });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Problème serveur" });
  }
}
