import { Request, Response } from "express";
import putCourseNewObjective from "../../models/course/put-course-new-Objective";

async function httpPutCourseNewObjective(req: Request, res: Response) {
  const { courseId } = req.params;
  const objective = req.body;

  try {
    const response = await putCourseNewObjective(+courseId, objective);
    return res.status(201).json({
      success: true,
      message: "Un nouvel objectif a été ajouté au cours et au parcours",
      data: response,
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpPutCourseNewObjective;
