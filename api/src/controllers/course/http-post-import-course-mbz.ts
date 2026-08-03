import { Request, Response } from "express";
import { Readable } from "stream";
import importCourseMbz from "../../models/course/import-course-mbz";

export default async function httpPostImportCourseMbz(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({
      error: "Un fichier d'archive Moodle (.mbz) est requis.",
    });
  }

  try {
    const archive = await importCourseMbz(req.file);
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${archive.courseSlug}.zip"`,
    );
    res.setHeader("X-Course-Slug", archive.courseSlug);
    Readable.fromWeb(archive.body as any).pipe(res);
  } catch (error) {
    console.error("Erreur lors du traitement de l'archive MBZ:", error);
    return res.status(500).json({
      error: "Impossible de générer le package de cours via l'IA.",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
}
