import type { Response } from "express";
import getPreliminaryQuizProgress from "../../models/quiz/get-preliminary-quiz-progress.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { serverIssue } from "../../utils/constantes.ts";

export default async function httpGetPreliminaryQuizProgress(req: CustomRequest, res: Response) {
  const userId = req.auth?.userId;
  if (!userId) return res.status(401).json({ message: "Session absente ou expirée" });

  try {
    const progress = await getPreliminaryQuizProgress(Number(req.params.moduleId), userId);
    return res.json(progress);
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({ message: error.message ?? serverIssue });
  }
}
