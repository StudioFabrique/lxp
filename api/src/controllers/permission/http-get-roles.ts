import { Request, Response } from "express";
import getRoles from "../../models/permission/get-roles";

export default async function httpGetRoles(req: Request, res: Response) {
  const roles = await getRoles();

  return res
    .status(200)
    .json({ message: "les rôles ont bien été récupérés", data: roles });
}
