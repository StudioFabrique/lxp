import { Response } from "express";
import getCourseById from "../../models/course/get-course-by-id";
import { trackTokens } from "../../models/stats/trackTokens";
import {
  AiApiError,
  AiConfigurationError,
  aiApiClient,
} from "../../services/ai/ai-api-client";
import { toQuizApiQuestion } from "../../services/quiz/quiz-question";
import { quizRepository } from "../../services/quiz/quiz-repository";
import { relayQuizStream } from "../../services/quiz/quiz-stream";
import CustomRequest from "../../utils/interfaces/express/custom-request";

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

    const course = await getCourseById(courseId);
    if (!course) return res.status(404).json({ error: "Cours introuvable" });
    if (!course.courseSlug) {
      return res.status(409).json({
        code: "AI_CONTENT_NOT_INDEXED",
        error: "Les fonctionnalités IA de ce cours copié ne sont pas indexées.",
      });
    }

    const student = await quizRepository.findStudentByMongoId(String(userId));
    if (!student) {
      return res
        .status(404)
        .json({ error: "Profil étudiant introuvable dans Postgres" });
    }

    const cachedQuiz = await quizRepository.findEndingQuiz(
      courseId,
      student.id,
    );

    if (cachedQuiz?.questions.length) {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Transfer-Encoding", "chunked");
      for (const question of cachedQuiz.questions) {
        res.write(`${JSON.stringify(toQuizApiQuestion(question))}\n`);
      }
      res.write(
        `${JSON.stringify({
          event: "done",
          total_questions: cachedQuiz.questions.length,
          elapsed_sec: 0,
          tokens: { total_tokens: 0 },
        })}\n`,
      );
      return res.end();
    }

    const aiStream = await aiApiClient.postStream("/quiz/generate/stream", {
      subject: userId,
      accept: "application/json",
      body: {
        course_slug: course.courseSlug,
        num_questions: 10,
        profile: {
          user_id: String(userId),
          course_id: String(courseId),
        },
      },
    });

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    let generatedQuizId: number | undefined;
    await relayQuizStream(aiStream, res, {
      onQuestion: async (question) => {
        if (!generatedQuizId) {
          const quiz = await quizRepository.createEndingQuiz(
            `Quiz de fin - ${course.title}`,
            courseId,
            student.id,
          );
          generatedQuizId = quiz.id;
        }

        await quizRepository.saveQuestion(question, {
          quizId: generatedQuizId,
        });
      },
      onDone: async (event) => {
        const totalTokens = event.tokens?.total_tokens;
        if (totalTokens) await trackTokens(userId, totalTokens);
      },
    });
  } catch (error) {
    console.error("Erreur de génération du quiz de fin :", error);

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

    return res.status(500).json({ error: "Impossible de joindre l'API" });
  }
}
