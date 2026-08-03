import { Request, Response } from "express";
import { listRoles } from "../../models/permission/roles";

export default async function httpGetAllRoles(_req: Request, res: Response) {
  try {
    return res.status(200).json({
      message: "les rôles ont bien été récupérés",
      data: await listRoles(),
    });
  } catch {
    return res.status(500).json({ message: "Problème serveur" });
  }
}
