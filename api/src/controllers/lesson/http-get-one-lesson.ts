import { Request, Response, NextFunction } from "express";
import getOneLesson from "../../models/lesson/get-one-lesson";
import { serverIssue } from "../../utils/constantes";

export default async function httpGetOneLesson(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { lessonId } = req.params;
    const response = await getOneLesson(+lessonId);
    next({ statusCode: 200, data: { success: true, lesson: response } });
  } catch (error: any) {
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
