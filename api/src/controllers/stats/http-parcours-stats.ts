import { Request, Response } from "express";
import getParcoursStats from "../../models/stats/get-parcours-stats";

export default async function httpParcoursStats(req: Request, res: Response) {
  const parcoursId = parseInt(req.params.id);

  const parcours = await getParcoursStats(parcoursId);

  return res.json({ data: parcours });
}
