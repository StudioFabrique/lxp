import { Request, Response } from "express";
import putCourseLesson from "../../models/course/put-course-lesson";

async function httpPutCourseLesson(req: Request, res: Response) {
  const { courseId } = req.params;
  const lesson = req.body;

  try {
    const response = await putCourseLesson(+courseId, lesson);
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpPutCourseLesson;
