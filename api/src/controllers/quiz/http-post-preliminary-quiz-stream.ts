import { Response } from "express";
import {
  AiApiError,
  AiConfigurationError,
} from "../../services/ai/ai-api-client";
import { toQuizApiQuestion } from "../../services/quiz/quiz-question";
import {
  preparePreliminaryQuizGeneration,
  QuizGenerationError,
} from "../../models/quiz/quiz-generation";
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
    const generation = await preparePreliminaryQuizGeneration(
      moduleId,
      req.auth?.userId || "student",
      questionCount,
    );

    if (generation.kind === "cached") {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      for (const question of generation.questions) {
        res.write(
          `event: question\ndata: ${JSON.stringify(
            toQuizApiQuestion(question),
          )}\n\n`,
        );
      }
      res.write('event: done\ndata: {"status": "cached"}\n\n');
      return res.end();
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    await relayQuizStream(generation.stream, res, generation);
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
    if (error instanceof QuizGenerationError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Erreur lors du traitement." });
  }
}
