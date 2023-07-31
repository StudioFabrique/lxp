import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { badQuery } from "../../utils/constantes";
import updateParcoursInfos from "../../models/parcours/update-parcours-infos";

async function httpUpdateParcoursInfos(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }
  console.log(req.body);

  try {
    const { parcoursId, title, description, formation } = req.body;

    const response = await updateParcoursInfos(
      parseInt(parcoursId),
      title,
      description,
      parseInt(formation)
    );
    if (response) {
      return res
        .status(201)
        .json({ message: "Informations du parcours mises à jour" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpUpdateParcoursInfos;
