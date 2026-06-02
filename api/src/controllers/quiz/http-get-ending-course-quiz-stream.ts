import { Response } from "express";
import { Readable } from "stream";
import getCourseById from "../../models/course/get-course-by-id";
import dotenv from "dotenv";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { trackTokens } from "../../models/stats/trackTokens";
import { prisma } from "../../utils/db";

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
  const { userId } = req.auth ?? {};

  try {
    const course = await getCourseById(+courseId);
    if (!course) return res.status(404).json({ error: "Cours introuvable" });

    // 1. Vérification du cache Prisma
    let quizz = await prisma.quiz.findFirst({
      where: { courseId: +courseId, type: "ending_course" },
      include: { questions: true },
    });

    // 2. Si le quizz existe déjà, on SIMULE le stream pour le client
    if (quizz && quizz.questions.length > 0) {
      console.log("Renvoi du Quizz de fin depuis le cache");
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Transfer-Encoding", "chunked");

      quizz.questions.forEach((q) => {
        const payload = {
          id: q.externalId,
          type: q.type,
          prompt: q.prompt,
          difficulty: q.difficulty,
          explanation_correct: q.explanationTrue,
          explanation_wrong: q.explanationWrong,
          tags: q.tags,
          ...(q.data as any),
        };
        res.write(JSON.stringify(payload) + "\n");
      });

      // Simuler l'événement de fin
      res.write(
        JSON.stringify({
          event: "done",
          total_questions: quizz.questions.length,
          elapsed_sec: 0,
          tokens: { total_tokens: 0 },
        }) + "\n",
      );
      return res.end();
    }

    // 3. Sinon, on appelle l'API IA
    const quizzesRequestPayload = {
      course_name: course.title,
      activity_content: course.content,
      profile: {
        user_id: userId ? String(userId) : undefined,
        course_id: String(courseId),
      },
    };

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

    if (!response.ok) throw new Error(`Erreur API: ${response.statusText}`);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    const nodeStream = Readable.fromWeb(response.body as QuizResponseStream);
    nodeStream.pipe(res);

    // 4. Interception pour sauvegarde en BDD
    let accumulatedData = "";
    nodeStream.on("data", (chunk) => {
      accumulatedData += chunk.toString();
    });

    nodeStream.on("end", async () => {
      try {
        const lines = accumulatedData.split("\n");
        const generatedQuestions = [];

        for (const line of lines) {
          const cleanLine = line.trim().replace(/^data:\s*/, "");
          if (!cleanLine) continue;

          const parsed = JSON.parse(cleanLine);

          if (parsed?.event === "done") {
            if (parsed?.tokens?.total_tokens && userId) {
              await trackTokens(userId, parsed.tokens.total_tokens);
            }
          } else if (parsed?.prompt) {
            // C'est une question, on la prépare pour l'insertion
            const {
              id,
              type,
              prompt,
              difficulty,
              explanation_correct,
              explanation_wrong,
              tags,
              ...specificData
            } = parsed;
            generatedQuestions.push({
              externalId: id,
              type,
              prompt,
              difficulty: difficulty || "medium",
              explanationTrue: explanation_correct,
              explanationWrong: explanation_wrong,
              tags: tags || [],
              data: specificData,
            });
          }
        }

        // 5. Sauvegarde transactionnelle dans Prisma
        if (generatedQuestions.length > 0) {
          await prisma.quiz.create({
            data: {
              title: `Quiz de fin - ${course.title}`,
              type: "ending_course",
              courseId: +courseId,
              questions: {
                create: generatedQuestions,
              },
            },
          });
        }
      } catch (streamError) {
        console.error(
          "Erreur lors de l'extraction/sauvegarde du stream :",
          streamError,
        );
      }
    });
  } catch (error) {
    console.error("Erreur backend:", error);
    res.status(500).json({ error: "Impossible de joindre l'API" });
  }
}
