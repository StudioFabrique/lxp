import { type Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import getModuleDetail from "../../models/module/get-module-detail.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import getModuleImage from "../../models/module/get-module-image.ts";

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
