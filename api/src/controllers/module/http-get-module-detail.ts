import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getModuleDetail from "../../models/module/get-module-detail";

export default async function httpGetModuleDetail(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    const response = await getModuleDetail(+moduleId);
    return res
      .status(200)
      .json({
        message: "Les détails du module ont bien étés récupérés",
        data: response,
      });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
