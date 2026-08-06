import { type Request, type Response } from "express";
import getRootAdminParcours from "../../models/parcours/get-root-admin-parcours.ts";
import { serverIssue } from "../../utils/constantes.ts";

export default async function httpGetRootAdminParcours(
  req: Request,
  res: Response
) {
  try {
    const response = await getRootAdminParcours();
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: serverIssue });
  }
}
