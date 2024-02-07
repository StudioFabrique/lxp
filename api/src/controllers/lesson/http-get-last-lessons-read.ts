import { Request, Response } from "express";

import { serverIssue } from "../../utils/constantes";
import getLessonDetail from "../../models/lesson/get-lesson-detail";

export default async function httpGetLessonDetail(req: Request, res: Response) {
  const { lessonId } = req.params;

  try {
    const lesson = await getLessonDetail(+lessonId);
    return res.status(200).json(lesson);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
