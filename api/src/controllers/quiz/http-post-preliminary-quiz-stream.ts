import { Response } from "express";
import {
  AiApiError,
  AiConfigurationError,
  aiApiClient,
} from "../../services/ai/ai-api-client";
import { toQuizApiQuestion } from "../../services/quiz/quiz-question";
import { quizRepository } from "../../services/quiz/quiz-repository";
import { relayQuizStream } from "../../services/quiz/quiz-stream";
import CustomRequest from "../../utils/interfaces/express/custom-request";

interface ModuleInfo {
  moduleId: number;
}

export default async function httpPostPreliminaryQuizStream(
  req: CustomRequest,
  res: Response,
) {
  const questionCount = Number(req.query.n ?? 5);
  const { moduleId } = req.body as ModuleInfo;

  try {
    const module = await quizRepository.findPreliminaryModule(moduleId);
    if (!module) {
      return res.status(404).json({ error: "Module non trouvé." });
    }

    const cachedQuiz = await quizRepository.findPreliminaryQuiz(module.id);

    if (cachedQuiz?.questions.length) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      for (const question of cachedQuiz.questions) {
        res.write(
          `event: question\ndata: ${JSON.stringify(
            toQuizApiQuestion(question),
          )}\n\n`,
        );
      }
      res.write('event: done\ndata: {"status": "cached"}\n\n');
      return res.end();
    }

    const aiStream = await aiApiClient.postStream("/quiz/preliminary/stream", {
      subject: req.auth?.userId || "student",
      accept: "text/event-stream",
      body: {
        n: questionCount,
        title: module.title,
        description: module.description,
        teacher_instructions: module.quizInstructions,
      },
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let generatedQuizId: number | undefined;
    await relayQuizStream(aiStream, res, {
      onQuestion: async (question) => {
        if (!generatedQuizId) {
          const quiz = await quizRepository.createPreliminaryQuiz(
            `Quiz préliminaire - ${module.title}`,
            module.id,
          );
          generatedQuizId = quiz.id;
        }

        await quizRepository.saveQuestion(question, {
          quizId: generatedQuizId,
        });
      },
    });
  } catch (error) {
    console.error("Erreur de génération du quiz préliminaire :", error);

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

    return res.status(500).json({ error: "Erreur lors du traitement." });
  }
}
