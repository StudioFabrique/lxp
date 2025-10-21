import { Request, Response } from "express";

import { serverIssue } from "../../utils/constantes";
import getLessonDetail from "../../models/lesson/get-lesson-detail";
import CustomRequest from "../../utils/interfaces/express/custom-request";

export default async function httpGetLessonDetail(
  req: CustomRequest,
  res: Response
) {
  const userId = req.auth?.userId;
  const { lessonId } = req.params;

  try {
    const lesson = await getLessonDetail(+lessonId, userId);
    return res.status(200).json(lesson);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
