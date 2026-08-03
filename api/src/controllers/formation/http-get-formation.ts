import { type Request, type Response } from "express";

import getFormation from "../../models/formation/get-formation.ts";
import { noData, serverIssue } from "../../utils/constantes.ts";

async function httpGetFormation(req: Request, res: Response) {
  try {
    const response = await getFormation();

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
