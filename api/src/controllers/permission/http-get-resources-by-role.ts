import { Request, Response } from "express";
import { getRoleResources } from "../../models/permission/roles";
import { serverIssue } from "../../utils/constantes";

export default async function httpGetResourcesByRole(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await getRoleResources({ identifier: "role", role: req.params.role }),
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
