import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

/**
 * POST /course/import-mbz
 * Étape 1 : Réceptionne le .mbz du front, le pousse à l'IA,
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

    // 1. Préparation du FormData pour l'API IA externa
    const formData = new FormData();
    const fileBlob = new Blob([file.buffer], { type: file.mimetype });
    formData.append("file", fileBlob, file.originalname);

    // 2. Appel de l'ingestion IA
    const ingestResponse = await fetch(
      `${process.env.DOCKER_IA_API_BASE_URL}/ingest`,
      {
        method: "POST",
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

    // 3. Téléchargement du fichier ZIP généré par l'IA
    const zipResponse = await fetch(
      `${process.env.DOCKER_IA_API_BASE_URL}/export/${courseSlug}.zip`,
    );

    if (!zipResponse.ok) {
      throw new Error(
        `Impossible de récupérer le ZIP exporté pour le slug : ${courseSlug}`,
      );
    }

    const zipBuffer = await zipResponse.arrayBuffer();

    // 4. Envoi du fichier ZIP directement au frontend en binaire
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${courseSlug}.zip"`,
    );
    res.setHeader("X-Course-Slug", courseSlug); // Optionnel : transmet le slug dans les headers si besoin

    return res.send(Buffer.from(zipBuffer));
  } catch (error) {
    console.error("Erreur lors du traitement de l'archive MBZ:", error);
    return res.status(500).json({
      error: "Impossible de générer le package de cours via l'IA.",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
}
