import { Request, Response } from "express";
import getParcoursList from "../../models/module/get-parcours-list";
import { serverIssue } from "../../utils/constantes";

export default async function httpGetParcoursList(req: Request, res: Response) {
  try {
    let message = "";
    const response = await getParcoursList();
    message =
      response.length === 0 ? "Aucun parcours n'a été trouvé" : "success";
    return res.status(200).json({ message, response });
  } catch (error: any) {
    return res.status(500).json({ message: serverIssue });
  }
}
