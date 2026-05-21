import { Request, Response } from "express";
import { Readable } from "stream";
import dotenv from "dotenv";
import { prisma } from "../../utils/db";

dotenv.config();

interface ModuleInfo {
  title: string;
}

/**
 * POST /quiz/preliminary/stream?n=10
 * Récupérer un set de quiz diagnostique généré par IA pour le début d'un module sous forme de stream
 *
 * Requête:
 * - Query param: n (int, optionnel, défaut 10) - nombre cible de questions
 * - Body: ModuleInfo { title }
 *
 * Réponse (streaming SSE):
 * - event: question | progress | done | error
 * - data: payload JSON correspondant
 */
export default async function httpPostPreliminaryQuizStream(
  req: Request,
  res: Response,
) {
  const { n = 5 } = req.query;
  const { title } = req.body as ModuleInfo;

  try {
    const module = await prisma.module.findFirst({
      where: {
        title: title,
      },
      select: {
        title: true,
        description: true,
        quizInstructions: true,
      },
    });

    if (!module) {
      throw new Error("Module non trouvé.");
    }

    // Préparation du payload pour l'API IA
    const iaPayload = {
      n: Number(n),
      title: module.title,
      description: module.description,
      teacher_instructions: module.quizInstructions,
    };

    // Appel de l'API externe
    const response = await fetch(
      `${process.env.DOCKER_IA_API_BASE_URL}/quiz/preliminary/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(iaPayload),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Erreur API IA: ${response.status} ${response.statusText}`,
      );
    }

    // Préparation de la réponse Express pour du streaming SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");

    // Conversion du stream Web (fetch) en stream Node et envoi au client
    const nodeStream = Readable.fromWeb(response.body as any);
    nodeStream.pipe(res);
  } catch (error) {
    console.error("Erreur backend lors du proxy stream préliminaire:", error);
    res.status(500).json({
      error: "Impossible de joindre l'API de génération IA.",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
}
