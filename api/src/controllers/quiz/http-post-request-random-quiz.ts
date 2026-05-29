import { Response } from "express";
import dotenv from "dotenv";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { trackTokens } from "../../models/stats/trackTokens";

dotenv.config();

type QuizResponse = {
  id: string;
  type: string;
  prompt: string;
  difficulty: string | null;
  bloom: string | null;
  choices: string[] | null;
  answer_key: string | boolean;
  choice_feedback: string | null;
  explanation_correct: string | null;
  explanation_wrong: string | null;
  evidence: string | null;
  tags: string[];
  tokens: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  session_meta: {
    user_id: string;
    course_id: string;
    past_questions: string[];
  };
};

/**
 * POST /quiz/random
 * Récupérer dans le body :
 * - content : une valeur de type texte sans aucune balise.
 * - past_questions : historique optionnel renvoyé par le client pour éviter les doublons
 *
 * Appelle l'API du docker IA en encapsulant le profil de l'utilisateur connecté
 */
export default async function httpPostRequestRandomQuiz(
  req: CustomRequest,
  res: Response,
) {
  try {
    const {
      content,
      temperature = 0.7,
      toxicity_threshold = 0.6,
      max_attempts = 4,
      past_questions = [],
    } = req.body;

    // Récupération sécurisée du userId
    const { userId } = req.auth ?? {};

    // Préparation du payload pour l'API de l'IA
    const iaPayload: Record<string, any> = {
      content,
      temperature,
      toxicity_threshold,
      max_attempts,
      past_questions,
    };

    if (userId) {
      iaPayload.profile = {
        user_id: String(userId),
      };
    }

    console.log(
      `Appel de l'API IA : ${process.env.DOCKER_IA_API_BASE_URL}/quiz/random`,
    );

    // Appel de l'API externe
    const response = await fetch(
      `${process.env.DOCKER_IA_API_BASE_URL}/quiz/random`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(iaPayload),
      },
    );

    const data = (await response.json()) as QuizResponse;

    if (!response.ok) {
      console.error(
        `Erreur API IA au endpoint /quiz/random (${response.status}):`,
        data,
      );
      return res.status(response.status).json(data);
    }

    // --- ENREGISTREMENT DES TOKENS ---
    if (userId && data?.tokens?.total_tokens) {
      await trackTokens(userId, data.tokens.total_tokens);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erreur backend lors du proxy /quiz/random :", error);
    return res
      .status(500)
      .json({ error: "Impossible de joindre l'API de génération IA." });
  }
}
