import { Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import getModuleDetail from "../../models/module/get-module-detail";
import CustomRequest from "../../utils/interfaces/express/custom-request";

export default async function httpGetModuleDetail(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(404).json({ message: badQuery });
  }

  try {
    const { moduleId } = req.params;
    console.log("controller module id :", moduleId);
    const response = await getModuleDetail(+moduleId, userId);
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
