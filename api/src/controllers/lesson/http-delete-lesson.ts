import { Request, Response } from "express";

import deleteLesson from "../../models/lesson/delete-lesson";
import CustomRequest from "../../utils/interfaces/express/custom-request";

export default async function httpDeleteLesson(
  req: CustomRequest,
  res: Response
) {
  const { lessonId } = req.params;
  const userId = req.auth?.userId;

  try {
    await deleteLesson(userId!, +lessonId);
    return res.status(200).json({
      success: true,
      message: "La leçon a été supprimée avec succès",
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}
