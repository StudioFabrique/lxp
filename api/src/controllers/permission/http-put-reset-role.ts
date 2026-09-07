import { type Response } from "express";
import {
  getActorRank,
  resetRole,
} from "../../models/permission/roles.ts";
import { serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPutResetRole(
  req: CustomRequest,
  res: Response,
) {
  try {
    await resetRole(req.params.id, getActorRank(req.auth!.userRoles));
    return res.status(200).json({ message: "Mise à jour effectuée avec succès" });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
