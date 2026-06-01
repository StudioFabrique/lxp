import { Response } from "express";
import dotenv from "dotenv";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { trackTokens } from "../../models/stats/trackTokens";
import { prisma } from "../../utils/db";

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
    const { userId } = req.auth ?? {};

    // 1. Créer un hash du texte pour chercher dans le cache
    const contentHash = crypto.randomUUID().replace(/-/g, "");

    // 2. Vérifier si une question pour ce texte précis existe déjà
    const cachedQuestion = await prisma.quizQuestion.findUnique({
      where: { contentHash },
    });

    if (cachedQuestion) {
      console.log(
        "Renvoi de la question depuis le cache BDD (0 token utilisé)",
      );
      // Reconstruire l'objet tel que le front l'attend
      return res.status(200).json({
        id: cachedQuestion.externalId,
        type: cachedQuestion.type,
        prompt: cachedQuestion.prompt,
        difficulty: cachedQuestion.difficulty,
        explanation_correct: cachedQuestion.explanationTrue,
        explanation_wrong: cachedQuestion.explanationWrong,
        tags: cachedQuestion.tags,
        ...(cachedQuestion.data as any), // Réinjecte les choix, paires, etc.
        tokens: { total_tokens: 0 }, // Cache = gratuit
      });
    }

    // 3. Si non trouvée, appel à l'API IA
    const iaPayload: Record<string, any> = {
      content,
      temperature,
      toxicity_threshold,
      max_attempts,
      past_questions,
    };
    if (userId) iaPayload.profile = { user_id: String(userId) };

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

    if (!response.ok) return res.status(response.status).json(data);

    // 4. Sauvegarder la nouvelle question en BDD de manière asynchrone
    const {
      id,
      type,
      prompt,
      difficulty,
      explanation_correct,
      explanation_wrong,
      tags,
      tokens,
      ...specificData
    } = data;

    await prisma.quizQuestion
      .create({
        data: {
          externalId: id,
          type,
          prompt,
          difficulty: difficulty || "medium",
          explanationTrue: explanation_correct,
          explanationWrong: explanation_wrong,
          tags: tags || [],
          data: specificData, // Les données polymorphiques (choix, index de réponse, etc.)
          contentHash,
        },
      })
      .catch((e) => console.error("Erreur de sauvegarde cache:", e));

    if (userId && data?.tokens?.total_tokens) {
      await trackTokens(userId, data.tokens.total_tokens);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erreur backend:", error);
    return res.status(500).json({ error: "Impossible de générer le quiz." });
  }
}
