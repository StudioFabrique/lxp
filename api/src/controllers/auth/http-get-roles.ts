import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getRoles from "../../models/auth/get-roles";
import CustomRequest from "../../utils/interfaces/express/custom-request";

async function httpGetRoles(req: CustomRequest, res: Response) {
  try {
    const roles = await getRoles(req.auth!.userRoles[0]);
    return res.status(200).json(roles);
  } catch (err) {
    return res.status(500).json({
      message: serverIssue + err,
    });
  }
}

export default httpGetRoles;
