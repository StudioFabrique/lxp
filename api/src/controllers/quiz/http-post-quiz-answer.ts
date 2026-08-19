import { type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import postQuizAnswer from "../../models/quiz/post-quiz-answer.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPostQuizAnswer(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Session absente ou expirée" });
  }

  try {
    const { attemptId } = req.params;
    const { externalId, userAnswer } = req.body;

    const answer = await postQuizAnswer(
      Number(attemptId),
      String(externalId),
      userAnswer,
      userId,
    );

    if (!answer) {
      return res
        .status(404)
        .json({ message: "Tentative ou question introuvable." });
    }

    return res.status(201).json(answer);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
