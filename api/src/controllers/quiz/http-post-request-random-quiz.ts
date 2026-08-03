import { Response } from "express";
import { trackTokens } from "../../models/stats/trackTokens";
import {
  AiApiError,
  AiConfigurationError,
  aiApiClient,
} from "../../services/ai/ai-api-client";
import {
  AiQuizQuestion,
  createQuizGenerationKey,
} from "../../services/quiz/quiz-question";
import { quizRepository } from "../../services/quiz/quiz-repository";
import CustomRequest from "../../utils/interfaces/express/custom-request";

interface RandomQuizResponse extends AiQuizQuestion {
  tokens?: {
    total_tokens?: number;
  };
}

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
    const contentHash = createQuizGenerationKey();
    const data = await aiApiClient.postJson<RandomQuizResponse>(
      "/quiz/random",
      {
        subject: userId || "anonymous_student",
        body: {
          content,
          temperature,
          toxicity_threshold,
          max_attempts,
          past_questions,
          ...(userId && { profile: { user_id: String(userId) } }),
        },
      },
    );

    // La persistance est secondaire : elle rend la question signalable, mais
    // ne doit pas invalider une génération IA déjà réussie.
    await quizRepository
      .saveStandaloneQuestion(data, contentHash)
      .catch((error) => console.error("Erreur de sauvegarde cache:", error));

    const totalTokens = data.tokens?.total_tokens;
    if (userId && totalTokens) await trackTokens(userId, totalTokens);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erreur de génération d'une question aléatoire :", error);

    if (error instanceof AiConfigurationError) {
      return res.status(500).json({ error: error.message });
    }
    if (error instanceof AiApiError) {
      return res.status(error.status).json(error.responseBody);
    }

    return res.status(500).json({ error: "Impossible de générer le quiz." });
  }
}
