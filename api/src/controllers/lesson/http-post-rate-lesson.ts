import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { badQuery, serverIssue } from "../../utils/constantes";
import postRateLesson from "../../models/lesson/post-rate-lesson";

export default async function httpPostRateLesson(
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

    const response = await postRateLesson(+lessonId, userId, rate);

    if (!response) {
      return res.status(404).json({
        message: "Problème lors de la requête de notation de la leçon",
      });
    }

    return res.status(201).json({
      message: "La notation a bien été prise en compte",
      data: response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
