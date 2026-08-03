import { type Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import getLimitedModuleDetail from "../../models/module/get-limited-module-detail.ts";

export default async function httpGetLimitedModuleDetail(
  req: CustomRequest,
  res: Response
) {
  const userId = req.auth?.userId;
  const roles = req.auth?.userRoles;

  if (!(userId && roles)) {
    return res.status(404).json({ message: badQuery });
  }

  try {
    const { moduleId } = req.params;
    const response = await getLimitedModuleDetail(+moduleId, userId);
    return res.status(200).json({
      message: "Les détails du module ont bien étés récupérés",
      data: response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
