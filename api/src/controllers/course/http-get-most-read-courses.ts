import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";

import { badQuery, serverIssue } from "../../utils/constantes";
import getMostReadCourses from "../../models/course/get-most-read-courses";

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
    console.log(error);

    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
