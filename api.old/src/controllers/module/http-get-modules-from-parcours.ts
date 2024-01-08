import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getModulesFromParcours from "../../models/module/get-modules-from-parcours";

async function httpGetModulesFromParcours(req: Request, res: Response) {
  const { parcoursId } = req.params;

  try {
    const response = await getModulesFromParcours(+parcoursId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpGetModulesFromParcours;
