import { Request, Response } from "express";
import getParcours from "../../models/parcours/get-parcours";
import { serverIssue } from "../../utils/constantes";

async function httpGetParcours(req: Request, res: Response) {
  try {
    const result = await getParcours();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

export default httpGetParcours;
