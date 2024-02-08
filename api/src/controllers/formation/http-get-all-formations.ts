import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getAllFormations from "../../models/formation/get-all-formations";

export default async function httpGetAllFormations(
  _req: Request,
  res: Response
) {
  try {
    const response = await getAllFormations();
    return res.status(200).json({
      success: true,
      message: response.length === 0 ? "Liste vide." : "",
      response,
    });
  } catch (error: any) {
    return res.status(500).json({ message: serverIssue });
  }
}
