import { type Request, type Response } from "express";

import { serverIssue } from "../../utils/constantes.ts";
import getLessonDetail from "../../models/lesson/get-lesson-detail.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

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
