import { Request, Response } from "express";
import dotenv from "dotenv";
import { Readable } from "stream"; // 1. IMPORTANT : Importer Readable pour le streaming
import { sign } from "jsonwebtoken";

dotenv.config();

/**
 * POST /course/import-mbz
 * Réceptionne le .mbz du front, le pousse à l'IA,
 * récupère le package .zip généré et le renvoie directement au front.
 */
export default async function httpPostImportCourseMbz(
  req: Request,
  res: Response,
) {
  const file = req.file;

  try {
    if (!file) {
      return res.status(400).json({
        error: "Un fichier d'archive Moodle (.mbz) est requis.",
      });
    }

    console.log(`[MBZ] Envoi du fichier ${file.originalname} à l'API IA...`);

    // Préparation du FormData pour l'API IA externe
    const formData = new FormData();
    const fileBlob = new Blob([file.buffer], { type: file.mimetype });
    formData.append("file", fileBlob, file.originalname);

    const secret = process.env.DOCKER_IA_AUTH_SECRET;

    if (!secret)
      return res.status(500).json({
        error:
          "Internal server error : Le secret JWT pour le docker IA n'est pas configuré",
      });

    const token = sign(
      {
        sub: "student",
        userRoles: [{ role: "admin" }],
      },
      secret,
    );

    // Appel de l'ingestion IA
    const ingestResponse = await fetch(
      `${process.env.DOCKER_IA_API_BASE_URL}/ingest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!ingestResponse.ok) {
      const errorText = await ingestResponse.text();
      throw new Error(`Erreur API IA (/ingest): ${errorText}`);
    }

    const iaData = (await ingestResponse.json()) as any;
    const courseSlug = iaData.course_slug;

    console.log(
      `[MBZ] Ingestion IA réussie (Slug: ${courseSlug}). Récupération du ZIP...`,
    );

    // Téléchargement du fichier ZIP généré par l'IA
    const zipResponse = await fetch(
      `${process.env.DOCKER_IA_API_BASE_URL}/export/${courseSlug}.zip`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!zipResponse.ok) {
      throw new Error(
        `Impossible de récupérer le ZIP exporté pour le slug : ${courseSlug}`,
      );
    }

    // Configuration des en-têtes de réponse pour le fichier binaire ZIP
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${courseSlug}.zip"`,
    );
    res.setHeader("X-Course-Slug", courseSlug);

    // Streaming direct du flux Web (fetch) vers Express (pipe)
    const nodeStream = Readable.fromWeb(zipResponse.body as any);
    nodeStream.pipe(res);
  } catch (error) {
    console.error("Erreur lors du traitement de l'archive MBZ:", error);
    return res.status(500).json({
      error: "Impossible de générer le package de cours via l'IA.",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
}
