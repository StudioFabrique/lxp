import { type Response } from "express";
import getAllModules from "../../models/module/get-all-modules.ts";
import { serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function httpGetAllModules(req: CustomRequest, res: Response) {
  try {
    let message = "";
    const response = await getAllModules(await resolveAccessScope(req.auth!));
    message = response.length === 0 ? "Aucun module n'a été trouvé" : "success";

    return res.status(200).json({ message, response });
  } catch (error: any) {
    return res.status(500).json({ message: serverIssue });
  }
}
