import { Request, Response } from "express";
import getRoles from "../../models/role/get-roles";

export default async function httpGetRoles(req: Request, res: Response) {
  try {
    const roles = await getRoles();

    return res
      .status(200)
      .json({ message: "les rôles ont bien été récupérés", data: roles });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Problème serveur" });
  }
}
