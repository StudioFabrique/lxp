import { type Response } from "express";
import {
  getActorRank,
  getRoleResources,
} from "../../models/permission/roles.ts";
import { serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpGetResourcesById(
  req: CustomRequest,
  res: Response,
) {
  try {
    return res.status(200).json({
      data: await getRoleResources(
        { identifier: "_id", _id: req.params.id },
        getActorRank(req.auth!.userRoles),
      ),
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
