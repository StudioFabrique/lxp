import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { badQuery } from "../../utils/constantes";
import updateImage from "../../models/parcours/update-image";

async function httpUpdateImage(req: Request, res: Response) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: badQuery });
    }
    console.log(req.body);

    const { parcoursId, image } = req.body;
    const response = await updateImage(parcoursId, image);
    if (response) {
      return res.status(201).json({ message: "Mise à jour réussie" });
    }
    return res.status(400).json({ message: badQuery });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpUpdateImage;
