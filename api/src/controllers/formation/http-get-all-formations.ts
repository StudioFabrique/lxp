import { type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import getAllFormations from "../../models/formation/get-all-formations.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function httpGetAllFormations(
  req: CustomRequest,
  res: Response
) {
  try {
    const response = await getAllFormations(await resolveAccessScope(req.auth!));
    return res.status(200).json({
      success: true,
      message: response.length === 0 ? "Liste vide." : "",
      response,
    });
  } catch (error: any) {
    return res.status(500).json({ message: serverIssue });
  }
}
