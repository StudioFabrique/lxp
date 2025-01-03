import { Request, Response } from "express";
import { getAllRoles } from "../../utils/rbac/rbac-utils";

export default async function httpGetAllRoles(_req: Request, res: Response) {
  try {
    const roles = await getAllRoles();
    return res
      .status(200)
      .json({ message: "les rôles ont bien été récupérés", data: roles });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Problème serveur" });
  }
}
