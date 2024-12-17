import { Request, Response } from "express";
import { getAllRolesWithSearch } from "../../utils/rbac/rbac-utils";

export default async function httpGetSearchRoles(req: Request, res: Response) {
  try {
    const { searchValue } = req.params;

    const roles = await getAllRolesWithSearch(searchValue);
    return res
      .status(200)
      .json({ message: "les rôles ont bien été récupérés", data: roles });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Problème serveur" });
  }
}
