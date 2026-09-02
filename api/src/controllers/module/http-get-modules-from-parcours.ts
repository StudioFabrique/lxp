import { type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import getModulesFromParcours from "../../models/module/get-modules-from-parcours.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

async function httpGetModulesFromParcours(req: CustomRequest, res: Response) {
  const { parcoursId } = req.params;

  try {
    const response = await getModulesFromParcours(
      +parcoursId,
      await resolveAccessScope(req.auth!),
    );
    return res.status(200).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpGetModulesFromParcours;
