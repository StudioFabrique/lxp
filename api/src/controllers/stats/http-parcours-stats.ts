import { Request, Response } from "express";
import getParcoursStats from "../../models/stats/get-parcours-stats";

export default async function httpParcoursStats(req: Request, res: Response) {
  const parcoursId = parseInt(req.params.id);

  if (isNaN(parcoursId)) {
    return res.status(400).json({
      error: "Le parcours id est incorrect",
    });
  }

  const parcours = await getParcoursStats(parcoursId);

  return res.json({ data: parcours });
}
