import { Response } from "express";
import { Readable } from "stream";
import getCourseById from "../../models/course/get-course-by-id";
import dotenv from "dotenv";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { trackTokens } from "../../models/stats/trackTokens";
import { prisma } from "../../utils/db";
import { sign } from "jsonwebtoken";

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
 * Personnalisé par étudiant pour éviter la duplication et économiser les tokens.
 */
export default async function httpGetEndingCourseQuizStream(
  req: CustomRequest,
  res: Response,
) {
  const { courseId } = req.params;
  const { userId } = req.auth ?? {};

  try {
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    // Récupérer le cours
    const course = await getCourseById(+courseId);
    if (!course) return res.status(404).json({ error: "Cours introuvable" });

    const student = await prisma.student.findFirst({
      where: { idMdb: String(userId) },
    });

    if (!student) {
      return res
        .status(404)
        .json({ error: "Profil étudiant introuvable dans Postgres" });
    }

    // Vérification du cache Prisma (Filtré par cours ET par étudiant)
    let quizz = await prisma.quiz.findFirst({
      where: {
        courseId: +courseId,
        type: "ending_course",
        studentId: student.id,
      },
      include: { questions: true },
    });

    // Si le quizz existe déjà pour cet étudiant, simuler le stream
    if (quizz && quizz.questions.length > 0) {
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

    // Sinon, on appelle l'API IA
    const quizzesRequestPayload = {
      course_name: course.title,
      activity_content: course.content,
      profile: {
        user_id: String(userId),
        course_id: String(courseId),
      },
    };

    const secret = process.env.DOCKER_IA_AUTH_SECRET;

    if (!secret)
      return res.status(500).json({
        error:
          "Internal server error : Le secret JWT pour le docker IA n'est pas configuré",
      });

    const token = sign(
      {
        sub: userId,
        userRoles: [{ role: "admin" }],
      },
      secret,
    );

    const response = await fetch(
      `${process.env.DOCKER_IA_API_BASE_URL}/quiz/generate/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
            if (parsed?.tokens?.total_tokens) {
              await trackTokens(userId, parsed.tokens.total_tokens);
            }
          } else if (parsed?.prompt) {
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

        // Sauvegarde transactionnelle dans Prisma (Liée à l'étudiant)
        if (generatedQuestions.length > 0) {
          await prisma.quiz.create({
            data: {
              title: `Quiz de fin - ${course.title}`,
              type: "ending_course",
              courseId: +courseId,
              studentId: student.id,
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
