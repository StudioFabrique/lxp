import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import putRateLesson from "../../models/lesson/put-rate-lesson.ts";

export default async function httpPutRateLesson(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(404).json({ message: badQuery });
  }

  try {
    const { lessonId } = req.params;
    const { rate }: { rate: number } = req.body;

    const response = await putRateLesson(+lessonId, userId, rate);

    if (!response) {
      return res.status(404).json({
        message: "Problème lors de la requête de notation de la leçon",
      });
    }

    return res.status(201).json({
      message: "La nouvelle notation a bien été prise en compte",
      data: response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
