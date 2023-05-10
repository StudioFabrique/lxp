import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getRoles from "../../models/auth/getRoles";

async function httpGetRoles(req: Request, res: Response) {
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
