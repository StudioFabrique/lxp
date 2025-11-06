import { Response, NextFunction } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import postDuplicateLesson from "../../models/lesson/post-duplicate-lesson";
import { serverIssue } from "../../utils/constantes";

export default async function httpPostDuplicateLesson(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { courseId } = req.params;
    const lessonId = req.body;

    console.log({ lessonId });

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
