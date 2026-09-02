import type { NextFunction, Response } from "express";

import { importParcoursArchive } from "../../models/parcours/parcours-archive.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpImportParcours(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier ZIP n'a été envoyé." });
    }
    const rawFormationId = req.body?.formationId;
    const formationId =
      rawFormationId === undefined || rawFormationId === ""
        ? undefined
        : Number(rawFormationId);
    if (
      formationId !== undefined &&
      (!Number.isInteger(formationId) || formationId <= 0)
    ) {
      return res
        .status(400)
        .json({ message: "La formation sélectionnée n'est pas valide." });
    }
    const result = await importParcoursArchive(
      req.file.buffer,
      req.auth!.userId,
      formationId,
    );
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
