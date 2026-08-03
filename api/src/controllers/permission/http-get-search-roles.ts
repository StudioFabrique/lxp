import { Request, Response } from "express";
import { searchRoles } from "../../models/permission/roles";

export default async function httpGetSearchRoles(req: Request, res: Response) {
  try {
    return res.status(200).json({
      message: "les rôles ont bien été récupérés",
      data: await searchRoles(req.params.searchValue),
    });
  } catch {
    return res.status(500).json({ message: "Problème serveur" });
  }
}
