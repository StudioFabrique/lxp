import { Request, Response } from "express";

import getCourseScenario from "../../models/course/get-course-scenario";
import { serverIssue } from "../../utils/constantes";

async function httpGetCourseScenario(req: Request, res: Response) {
  const { courseId } = req.params;

  try {
    const response = await getCourseScenario(+courseId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpGetCourseScenario;
