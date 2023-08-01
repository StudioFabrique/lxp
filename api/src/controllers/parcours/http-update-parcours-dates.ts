import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery } from "../../utils/constantes";
import updateParcoursDates from "../../models/parcours/update-parcours-date";

async function httpUpdateParcoursDates(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const { parcoursId, startDate, endDate } = req.body;

    const response = await updateParcoursDates(
      parseInt(parcoursId),
      startDate,
      endDate
    );

    if (response) {
      return res.status(201).json({
        success: true,
        message: "Les dates du parcours ont été mises à jour",
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpUpdateParcoursDates;
