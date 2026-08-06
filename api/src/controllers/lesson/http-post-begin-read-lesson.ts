import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import postBeginReadLesson from "../../models/lesson/post-begin-read-lesson.ts";

export default async function httpPostBeginReadLesson(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(404).json({ message: badQuery });
  }

  try {
    const { lessonId } = req.params;

    const response = await postBeginReadLesson(+lessonId, userId);

    if (!response) {
      return res.status(404).json({
        message: "Problème lors de la requête de confirmation de lecture",
      });
    }

    return res.status(201).json({
      message: "La leçon a bien été marqué comme lu",
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
