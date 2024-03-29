import { Request, Response } from "express";
import getParcoursList from "../../models/parcours/get-parcours";

async function httpGetParcours(req: Request, res: Response) {
  try {
    const result = await getParcoursList();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

export default httpGetParcours;
