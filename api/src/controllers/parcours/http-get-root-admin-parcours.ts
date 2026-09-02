import { type Response } from "express";
import getRootAdminParcours from "../../models/parcours/get-root-admin-parcours.ts";
import { serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function httpGetRootAdminParcours(
  req: CustomRequest,
  res: Response
) {
  try {
    const response = await getRootAdminParcours(
      await resolveAccessScope(req.auth!),
    );
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: serverIssue });
  }
}
