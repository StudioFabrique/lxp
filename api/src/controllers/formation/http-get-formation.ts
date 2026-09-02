import { type Response } from "express";

import getFormation from "../../models/formation/get-formation.ts";
import { noData, serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

async function httpGetFormation(req: CustomRequest, res: Response) {
  try {
    const response = await getFormation(await resolveAccessScope(req.auth!));

    if (!response) {
      return res.status(404).json({ message: noData });
    } else {
      return res.status(200).json(response);
    }
  } catch (error) {
    return res.status(500).json({ message: serverIssue + error });
  }
}

export default httpGetFormation;
