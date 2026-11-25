import { type Request, type Response } from "express";
import putManyLessons from "../../models/course/put-many-lessons.ts";

async function httpPutManyLessons(req: Request, res: Response) {
  const { courseId } = req.params;
  const lessonsIds = req.body;

  try {
    await putManyLessons(+courseId, lessonsIds);
    return res.status(201).json({
      success: true,
      message: "Mise à jour de la liste des leçons réussie",
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.message,
    });
  }
}

export default httpPutManyLessons;
