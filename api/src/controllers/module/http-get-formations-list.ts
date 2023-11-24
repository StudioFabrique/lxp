import { Request, Response } from "express";
import getFormationList from "../../models/module/get-formatiion-list";
import { serverIssue } from "../../utils/constantes";

export default async function httpGetFormationsList(
  req: Request,
  res: Response
) {
  try {
    const response = await getFormationList();
    const message =
      response.length === 0 ? "Aucune formation n'a été trouvée" : "success";
    return res.status(200).json({ message, response });
  } catch (error: any) {
    return res.status(200).json({ message: serverIssue });
  }
}
