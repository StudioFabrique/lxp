import { Request, Response } from "express";
import deleteCourseLesson from "../../models/course/delete-course-lesson";

async function httpDeleteCourseLesson(req: Request, res: Response) {
  const { courseId, lessonId } = req.params;

  try {
    const response = await deleteCourseLesson(+courseId, +lessonId);
    return res.status(201).json({
      success: true,
      message: "La leçon a été supprimée avec succès",
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpDeleteCourseLesson;
