import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putReorderLessons from "../../models/lesson/put-reorder-lessons";

export default async function httpPutReorderLessons(
  req: Request,
  res: Response
) {
  try {
    const { courseId } = req.params;
    const lessonsId = req.body;

    const response = await putReorderLessons(+courseId, lessonsId);
    return res.status(200).json({
      success: true,
      message: "L'ordre des leçons a bien été modifié.",
      response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
