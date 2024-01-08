import { Request, Response } from "express";

import deleteLesson from "../../models/lesson/delete-lesson";

export default async function httpDeleteLesson(req: Request, res: Response) {
  const { lessonId } = req.params;

  try {
    await deleteLesson(+lessonId);
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
