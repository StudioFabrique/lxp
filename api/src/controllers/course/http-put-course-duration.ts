import { Request, Response } from "express";
import putCourseDuration from "../../models/course/put-course-duration";

async function httpPutCourseDuration(req: Request, res: Response) {
  const { courseId } = req.params;
  const { synchroneDuration, asynchroneDuration } = req.body;

  try {
    const response = await putCourseDuration(
      +courseId,
      +synchroneDuration,
      +asynchroneDuration
    );
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpPutCourseDuration;
