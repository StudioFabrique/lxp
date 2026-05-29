import { Request, Response } from "express";
import { Readable } from "stream";
import getCourseById from "../../models/course/get-course-by-id";
import dotenv from "dotenv";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { trackTokens } from "../../models/stats/trackTokens";

dotenv.config();

type QuizResponseStream = ReadableStream<{
  event: string;
  total_questions: number;
  level_counts: {
    easy: number;
    medium: number;
    hard: number;
  };
  content_richness: string;
  elapsed_sec: number;
  tokens: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}>;

/**
 * GET /quiz/course/ending/stream/:courseId
 * Récupérer un set de quiz généré par IA (5 questions) pour une fin de cours sous forme de stream
 * - courseId sera utilisé pour contextualiser les questions du quiz (le titre du cours, quelles sont les notions abordées dans le cours, etc.)
 */
export default async function httpGetEndingCourseQuizStream(
  req: CustomRequest,
  res: Response,
) {
  const { courseId } = req.params;
  const { userId } = req.auth ?? {}; // Récupération de l'identifiant utilisateur issu du token

  try {
    const course = await getCourseById(+courseId);

    if (!course) {
      return res.status(404).json({ error: "Cours introuvable" });
    }

    // Construction du payload aligné avec la documentation de l'API IA
    const quizzesRequestPayload = {
      course_name: course.title,
      activity_content: course.content,
      // model: "ministral-14b-2512",
      profile: {
        user_id: userId ? String(userId) : undefined,
        course_id: String(courseId),
        // Plus tard ajouter : experience_label, weak_concepts, etc.
      },
    };

    // Appel de l'API externe
    const response = await fetch(
      `${process.env.DOCKER_IA_API_BASE_URL}/quiz/generate/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(quizzesRequestPayload),
      },
    );

    if (!response.ok) {
      throw new Error(`Erreur API externe: ${response.statusText}`);
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    const nodeStream = Readable.fromWeb(response.body as any);
    nodeStream.pipe(res); // Le stream est envoyé directement au client sans attente

    // --- INTERCEPTION DU STREAM EN ARRIÈRE-PLAN POUR LES TOKENS ---
    let accumulatedData = "";
    nodeStream.on("data", (chunk) => {
      accumulatedData += chunk.toString();
    });

    nodeStream.on("end", async () => {
      try {
        // Découpage par ligne au cas où c'est du NDJSON / SSE (Server-Sent Events)
        const lines = accumulatedData.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          // Nettoyage si le format utilise un préfixe SSE "data:"
          const cleanLine = trimmed.startsWith("data:")
            ? trimmed.replace(/^data:\s*/, "")
            : trimmed;

          try {
            const parsed = JSON.parse(cleanLine);
            // Dès qu'on tombe sur le chunk ou l'événement final contenant les tokens
            if (parsed?.tokens?.total_tokens) {
              await trackTokens(userId, parsed.tokens.total_tokens);
              break;
            }
          } catch {
            // On ignore les lignes incomplètes ou les morceaux de JSON non valides
          }
        }
      } catch (streamError) {
        console.error(
          "Erreur lors de l'extraction des tokens du stream :",
          streamError,
        );
      }
    });
  } catch (error) {
    console.error("Erreur backend lors du proxy stream:", error);
    res
      .status(500)
      .json({ error: "Impossible de joindre l'API de génération" });
  }
}
