import { type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import putFinishQuizAttempt from "../../models/quiz/put-finish-quiz-attempt.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPutFinishQuizAttempt(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Session absente ou expirée" });
  }

  try {
    const { attemptId } = req.params;

    const attempt = await putFinishQuizAttempt(Number(attemptId), userId);

    if (!attempt) {
      return res.status(404).json({ message: "Tentative introuvable." });
    }

    return res.status(200).json(attempt);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
