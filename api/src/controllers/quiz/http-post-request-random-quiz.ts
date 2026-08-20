import { type Response } from "express";
import { generateRandomQuiz } from "../../models/quiz/quiz-generation.ts";
import {
  AiApiError,
  AiConfigurationError,
} from "../../services/ai/ai-api-client.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { logger } from "../../utils/logs/logger.ts";

/** POST /quiz/random — génère ou récupère une question mise en cache. */
export default async function httpPostRequestRandomQuiz(
  req: CustomRequest,
  res: Response,
) {
  const {
    content,
    temperature = 0.7,
    toxicity_threshold = 0.6,
    max_attempts = 4,
    past_questions = [],
  } = req.body;
  const userId = req.auth?.userId;

  try {
    const data = await generateRandomQuiz({
      content,
      temperature,
      toxicityThreshold: toxicity_threshold,
      maxAttempts: max_attempts,
      pastQuestions: past_questions,
      userId,
    });

    return res.status(200).json(data);
  } catch (error) {
    logger.error("Erreur de génération d'une question aléatoire :", error);

    if (error instanceof AiConfigurationError) {
      return res.status(500).json({ error: error.message });
    }
    if (error instanceof AiApiError) {
      return res.status(error.status).json(error.responseBody);
    }

    return res.status(500).json({ error: "Impossible de générer le quiz." });
  }
}
