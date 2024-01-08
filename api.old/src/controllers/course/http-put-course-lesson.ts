import { Request, Response } from "express";
import putCourseLesson from "../../models/course/put-course-lesson";
import CustomRequest from "../../utils/interfaces/express/custom-request";

async function httpPutCourseLesson(req: CustomRequest, res: Response) {
  const { courseId } = req.params;
  const lesson = req.body;

  const adminId = req.auth!.userId;

  try {
    const response = await putCourseLesson(+courseId, lesson, adminId);
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpPutCourseLesson;
