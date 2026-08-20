import { type Response, type NextFunction } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import postDuplicateLesson from "../../models/lesson/post-duplicate-lesson.ts";
import { serverIssue } from "../../utils/constantes.ts";

export default async function httpPostDuplicateLesson(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { courseId } = req.params;
    const lessonId = req.body;


    const adminId = req.auth!.userId;

    const response = await postDuplicateLesson(+courseId, lessonId, adminId);
    next({
      statusCode: 201,
      data: {
        success: true,
        message: "Leçon(s) dupliquée(s) avec succès",
        response,
      },
    });
  } catch (error: any) {
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
