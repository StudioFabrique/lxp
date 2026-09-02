import { type Response } from "express";
import getParcoursList from "../../models/parcours/get-parcours.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

async function httpGetParcours(req: CustomRequest, res: Response) {
  try {
    const result = await getParcoursList(await resolveAccessScope(req.auth!));
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

export default httpGetParcours;
