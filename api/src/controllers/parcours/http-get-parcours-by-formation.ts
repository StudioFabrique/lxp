import { type Response } from "express";

import { serverIssue } from "../../utils/constantes.ts";
import getParcoursByFormation from "../../models/parcours/get-parcours-by-formation.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

//  retourne la liste des parcours associés à une formation
async function httpGetParcoursByFormation(req: CustomRequest, res: Response) {
  try {
    const { formationId } = req.params;
    const response = await getParcoursByFormation(
      +formationId,
      await resolveAccessScope(req.auth!),
    );
    return res.status(200).json({
      success: true,
      message:
        response.length === 0 ? "Liste vide." : "Liste des parcours récupérée.",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({ message: serverIssue });
  }
}

export default httpGetParcoursByFormation;
