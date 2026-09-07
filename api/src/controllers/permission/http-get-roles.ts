import { type Response } from "express";
import {
  getActorRank,
  listRoles,
} from "../../models/permission/roles.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpGetAllRoles(
  req: CustomRequest,
  res: Response,
) {
  try {
    return res.status(200).json({
      message: "les rôles ont bien été récupérés",
      data: await listRoles(getActorRank(req.auth!.userRoles)),
    });
  } catch {
    return res.status(500).json({ message: "Problème serveur" });
  }
}
