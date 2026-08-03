import { Request, Response } from "express";
import { getRoleResources } from "../../models/permission/roles";
import { serverIssue } from "../../utils/constantes";

export default async function httpGetResourcesById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await getRoleResources({ identifier: "_id", _id: req.params.id }),
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
