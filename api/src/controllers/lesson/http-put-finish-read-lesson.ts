import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import putFinishReadLesson from "../../models/lesson/put-finish-read-lesson.ts";
import postRateLesson from "../../models/lesson/post-rate-lesson.ts";

export default async function httpPutFinishReadLesson(
  req: CustomRequest,
  res: Response
) {
  const userId = req.auth?.userId;
  const { lessonId } = req.params;
  const { rate } = req.query;

  if (!userId) {
    return res.status(404).json({ message: badQuery });
  }

  if (!rate)
    return res.status(400).json({
      message: badQuery + ", la note est manquante",
    });

  try {
    const lessonReadResponse = await putFinishReadLesson(+lessonId, userId);

    if (!lessonReadResponse) {
      return res.status(404).json({
        message: "Problème lors de la requête de confirmation de lecture",
      });
    }

    const ratingResponse = await postRateLesson(+lessonId, userId, +rate);

    if (!ratingResponse) {
      return res.status(404).json({
        message: "Problème lors de la requête de notation de la leçon",
      });
    }

    return res.status(201).json({
      message:
        "La leçon a bien été marqué comme lu et la notation a bien été prise en compte",
      lessonRead: lessonReadResponse,
      rating: ratingResponse,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
