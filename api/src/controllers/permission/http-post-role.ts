import { type Response } from "express";
import {
  createRole,
  getActorRank,
} from "../../models/permission/roles.ts";
import { serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPostRole(req: CustomRequest, res: Response) {
  try {
    const { role, label, rank } = req.body;
    await createRole(role, label, rank, getActorRank(req.auth!.userRoles));
    return res.status(201).send({ message: "Rôle créé avec succès" });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
