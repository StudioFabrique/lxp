import { type Request, type Response } from "express";
import getAllModules from "../../models/module/get-all-modules.ts";
import { serverIssue } from "../../utils/constantes.ts";

export default async function httpGetAllModules(req: Request, res: Response) {
  try {
    let message = "";
    const response = await getAllModules();
    message = response.length === 0 ? "Aucun module n'a été trouvé" : "success";

    return res.status(200).json({ message, response });
  } catch (error: any) {
    return res.status(500).json({ message: serverIssue });
  }
}
