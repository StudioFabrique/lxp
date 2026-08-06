import getBestRatedCourses from "../../models/course/get-best-rated-courses.ts";
import { noAccess } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { type Response } from "express";

export default async function httpGetBestRatedCourses(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;

  if (!userId) return res.status(403).json({ message: noAccess });

  try {
    const response = await getBestRatedCourses(userId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? noAccess });
  }
}
