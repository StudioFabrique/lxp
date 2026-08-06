import { type Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import getCoursesTimeline from "../../models/course/get-courses-timeline.ts";

export default async function httpGetCoursesTimeline(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;
  const { minDate, maxDate, showAllCourses } = req.query;

  if (!(userId && minDate && maxDate)) {
    return res.status(404).json({ message: badQuery });
  }

  try {
    const response = await getCoursesTimeline(
      userId,
      minDate as string,
      maxDate as string,
      showAllCourses === "true", // transformation en valeur booléenne
    );
    return res.status(200).json({
      message: "La timeline des cours a bien été récupérée",
      data: response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
