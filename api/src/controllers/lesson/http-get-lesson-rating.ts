import { Response } from "express";
import getLessonRating from "../../models/lesson/get-lesson-rating";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { badQuery, serverIssue } from "../../utils/constantes";

export default async function httpGetLessonRating(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(404).json({ message: badQuery });
  }

  try {
    const { lessonId } = req.params;

    const lessonRating = await getLessonRating(+lessonId, userId);

    res.json({
      message: "La notation de la leçon a bien été récupéré.",
      data: lessonRating,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
