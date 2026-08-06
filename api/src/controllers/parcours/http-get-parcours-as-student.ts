import { type Response } from "express";

import getParcoursByStudent from "../../models/parcours/get-parcours-by-student.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpGetParcoursAsStudent(
  req: CustomRequest,
  res: Response
) {
  const id = req.auth?.userId;

  if (!id) {
    return res.status(404).json({ message: "non trouvé" });
  }

  try {
    const result = await getParcoursByStudent(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
