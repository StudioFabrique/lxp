import { Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import getModuleDetail from "../../models/module/get-module-detail";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import getModuleImage from "../../models/module/get-module-image";

export default async function httpGetModuleImage(
  req: CustomRequest,
  res: Response
) {
  try {
    const { moduleId } = req.params;
    const response = await getModuleImage(+moduleId);
    return res.status(200).json({
      message: "L'image du module a bien été récupéré",
      data: response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
