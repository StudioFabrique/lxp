import type { NextFunction, Response } from "express";

import { exportParcoursArchive } from "../../models/parcours/parcours-archive.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpExportParcours(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const archive = await exportParcoursArchive(Number(req.params.parcoursId));
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${archive.filename}"`,
    );
    res.setHeader("Content-Length", archive.buffer.length.toString());
    return res.status(200).send(archive.buffer);
  } catch (error) {
    next(error);
  }
}
