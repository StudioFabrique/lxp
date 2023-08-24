import { Request, Response } from "express";

import { serverIssue } from "../../utils/constantes";
import getParcoursByFormation from "../../models/parcours/get-parcours-by-formation";

async function httpGetParcoursByFormation(req: Request, res: Response) {
  try {
    const { formationId } = req.params;
    const response = await getParcoursByFormation(+formationId);
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({ message: serverIssue });
  }
}

export default httpGetParcoursByFormation;
