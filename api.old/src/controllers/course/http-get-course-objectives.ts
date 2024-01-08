import { Request, Response } from "express";

import { serverIssue } from "../../utils/constantes";
import getCourseObjectives from "../../models/course/get-course-objectives";

async function httpGetCourseObjectives(req: Request, res: Response) {
  const { courseId } = req.params;

  try {
    const response = await getCourseObjectives(+courseId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : serverIssue,
    });
  }
}

export default httpGetCourseObjectives;
