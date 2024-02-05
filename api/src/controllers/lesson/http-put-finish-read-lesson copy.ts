import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { badQuery, serverIssue } from "../../utils/constantes";
import putFinishReadLesson from "../../models/lesson/put-finish-read-lesson";

export default async function httpPutFinishReadLesson(
  req: CustomRequest,
  res: Response
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(404).json({ message: badQuery });
  }

  try {
    const { lessonId } = req.params;

    const response = await putFinishReadLesson(+lessonId, userId);

    if (!response) {
      return res.status(404).json({ message: "Leçon non trouvé" });
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
