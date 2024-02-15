import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";

import { badQuery, serverIssue } from "../../utils/constantes";
import getLastLessonsRead from "../../models/lesson/get-last-lessons-read";

export default async function httpGetLastLessonsRead(
  req: CustomRequest,
  res: Response
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(404).json({ message: badQuery });
  }

  try {
    const response = await getLastLessonsRead(userId, 4);

    if (!response) {
      return res.status(404).json({ message: "Leçon non trouvé" });
    }

    return res.status(201).json({
      message: "Les dernière lecons lus ont été récupérées",
      data: response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
