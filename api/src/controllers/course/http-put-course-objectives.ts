import { Request, Response } from "express";

import putCourseObjectives from "../../models/course/put-course-objectives";

async function httpPutCourseObjectives(req: Request, res: Response) {
  const { courseId } = req.params;
  const objectivesIds = req.body;

  try {
    const response = await putCourseObjectives(+courseId, objectivesIds);
    return res.status(201).json({
      success: true,
      message: "Les objectifs du cours ont été mis à jour",
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpPutCourseObjectives;
