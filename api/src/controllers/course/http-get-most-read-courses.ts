import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

import { badQuery, serverIssue } from "../../utils/constantes.ts";
import getMostReadCourses from "../../models/course/get-most-read-courses.ts";

export default async function httpGetMostReadCourses(
  req: CustomRequest,
  res: Response
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(404).json({ message: badQuery });
  }

  try {
    const response = await getMostReadCourses(userId, 4);

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
