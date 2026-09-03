import type { NextFunction, Response } from "express";

import { importParcoursArchive } from "../../models/parcours/parcours-archive.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { parseParcoursImportOptions } from "./parcours-import-options.ts";

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
    const options = parseParcoursImportOptions(req.body);
    const result = await importParcoursArchive(
      req.file.buffer,
      req.auth!.userId,
      options,
    );
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
