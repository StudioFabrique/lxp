import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getRoles from "../../models/auth/get-roles";

async function httpGetRoles(req: Request, res: Response) {
  console.log("fetching roles");

  try {
    const roles = await getRoles();
    return res.status(200).json(roles);
  } catch (err) {
    return res.status(500).json({
      message: serverIssue + err,
    });
  }
}

export default httpGetRoles;
