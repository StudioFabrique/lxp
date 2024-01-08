import { Request, Response } from "express";

import { serverIssue } from "../../utils/constantes";
import getCourseSkills from "../../models/course/get-course-skills";

async function httpGetCourseSkills(req: Request, res: Response) {
  const { courseId } = req.params;

  try {
    const response = await getCourseSkills(+courseId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : serverIssue,
    });
  }
}

export default httpGetCourseSkills;
