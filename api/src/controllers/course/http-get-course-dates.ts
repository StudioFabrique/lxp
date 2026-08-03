import { type Request, type Response } from "express";
import getCourseDates from "../../models/course/get-courses-dates.ts";
import { serverIssue } from "../../utils/constantes.ts";

async function httpGetCourseDates(req: Request, res: Response) {
  const { courseId } = req.params;

  try {
    const response = await getCourseDates(+courseId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpGetCourseDates;
