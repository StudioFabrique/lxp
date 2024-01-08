import { Request, Response } from "express";

import putCourseIsPublished from "../../models/course/put-course-ispublished";
import { serverIssue } from "../../utils/constantes";

async function httpPutCourseIsPublished(req: Request, res: Response) {
  const { courseId } = req.params;

  try {
    await putCourseIsPublished(+courseId);
    return res
      .status(201)
      .json({ success: true, message: "Le cours a été publié avec succès" });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPutCourseIsPublished;
