import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

import { badQuery, serverIssue } from "../../utils/constantes.ts";
import getLastLessonsRead from "../../models/lesson/get-last-lessons-read.ts";

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
      return res
        .status(404)
        .json({ message: "Dernières leçons lues non trouvées" });
    }

    return res.status(201).json({
      message: "Les dernières leçons lues ont été récupérées",
      data: response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
