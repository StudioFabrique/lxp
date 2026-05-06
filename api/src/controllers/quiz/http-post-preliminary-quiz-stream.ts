import { Request, Response } from "express";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

interface ModuleInfo {
  title: string;
  description: string;
  teacher_instructions: string;
}

/**
 * POST /quiz/preliminary/stream?n=10
 * Récupérer un set de quiz diagnostique généré par IA pour le début d'un module sous forme de stream
 *
 * Requête:
 * - Query param: n (int, optionnel, défaut 10) - nombre cible de questions
 * - Body: ModuleInfo { title, description, teacher_instructions }
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
  const { title, description, teacher_instructions } = req.body as ModuleInfo;

  try {
    // Validation des entrées requises
    if (!title || !description || !teacher_instructions) {
      return res.status(400).json({
        error:
          "Les champs title, description et teacher_instructions sont requis",
      });
    }

    // Préparation du payload pour l'API IA
    const iaPayload = {
      n: Number(n),
      title,
      description,
      teacher_instructions,
    };

    console.log(
      `Appel API IA pour quiz préliminaire (${process.env.DOCKER_IA_API_BASE_URL}/quiz/preliminary/stream):`,
      iaPayload,
    );

    // Appel de l'API externe avec le fetch natif de Node
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
