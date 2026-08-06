import { type Request, type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import getRoles from "../../models/auth/get-current-roles.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

async function httpGetCurrentRoles(req: CustomRequest, res: Response) {
  try {
    const roles = await getRoles(req.auth!.userRoles[0]);
    return res.status(200).json(roles);
  } catch (err) {
    return res.status(500).json({
      message: serverIssue + err,
    });
  }
}

export default httpGetCurrentRoles;
