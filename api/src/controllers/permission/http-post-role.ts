import { type Request, type Response } from "express";
import { createRole } from "../../models/permission/roles.ts";
import { serverIssue } from "../../utils/constantes.ts";

export default async function httpPostRole(req: Request, res: Response) {
  try {
    const { role, label, rank } = req.body;
    await createRole(role, label, rank);
    return res.status(201).send({ message: "Rôle créé avec succès" });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
