import { type Response } from "express";
import {
  prepareEndingQuizGeneration,
  QuizGenerationError,
} from "../../models/quiz/quiz-generation.ts";
import {
  AiApiError,
  AiConfigurationError,
} from "../../services/ai/ai-api-client.ts";
import { toQuizApiQuestion } from "../../services/quiz/quiz-question.ts";
import { relayQuizStream } from "../../services/quiz/quiz-stream.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { logger } from "../../utils/logs/logger.ts";

/**
 * GET /quiz/course/ending/stream/:courseId
 * Génère un quiz de fin de cours ou renvoie la version mise en cache.
 */
export default async function httpGetEndingCourseQuizStream(
  req: CustomRequest,
  res: Response,
) {
  const courseId = Number(req.params.courseId);
  const userId = req.auth?.userId;

  try {
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const generation = await prepareEndingQuizGeneration(
      courseId,
      String(userId),
    );

    if (generation.kind === "cached") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Transfer-Encoding", "chunked");
      for (const question of generation.questions) {
        res.write(`${JSON.stringify(toQuizApiQuestion(question))}\n`);
      }
      res.write(
        `${JSON.stringify({
          event: "done",
          total_questions: generation.questions.length,
          elapsed_sec: 0,
          tokens: { total_tokens: 0 },
        })}\n`,
      );
      return res.end();
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");
    await relayQuizStream(generation.stream, res, generation);
  } catch (error) {
    logger.error("Erreur de génération du quiz de fin :", error);

    if (res.headersSent) {
      if (!res.writableEnded) res.end();
      return;
    }

    if (error instanceof AiConfigurationError) {
      return res.status(500).json({ error: error.message });
    }
    if (error instanceof AiApiError) {
      return res.status(error.status).json({ error: error.message });
    }
    if (error instanceof QuizGenerationError) {
      return res.status(error.statusCode).json({
        ...(error.code && { code: error.code }),
        error: error.message,
      });
    }

    return res.status(500).json({ error: "Impossible de joindre l'API" });
  }
}
