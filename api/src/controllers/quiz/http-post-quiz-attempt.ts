import { type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import type { QuizAttemptOrigin } from "../../config/quiz-attempt.ts";
import postQuizAttempt from "../../models/quiz/post-quiz-attempt.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPostQuizAttempt(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Session absente ou expirée" });
  }

  try {
    const { origin, courseId, moduleId } = req.body;

    const attempt = await postQuizAttempt(
      origin as QuizAttemptOrigin,
      {
        courseId: courseId === undefined ? undefined : Number(courseId),
        moduleId: moduleId === undefined ? undefined : Number(moduleId),
      },
      userId,
    );

    // Formateurs et administrateurs peuvent ouvrir un quiz sans qu'une
    // passation soit comptabilisée ; idem si le quiz n'a pas encore de ligne
    // en base au moment de l'ouverture.
    if (!attempt) {
      return res.status(204).send();
    }

    return res.status(201).json(attempt);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
