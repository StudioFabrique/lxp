import { type Request, type Response } from "express";

import { serverIssue } from "../../utils/constantes.ts";
import getCourseInformations from "../../models/course/get-course-informations.ts";

async function httpGetCourseInformations(req: Request, res: Response) {
  const { courseId } = req.params;

  try {
    const response = await getCourseInformations(+courseId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpGetCourseInformations;
