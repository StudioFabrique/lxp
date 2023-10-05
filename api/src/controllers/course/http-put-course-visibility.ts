import { Request, Response } from "express";

import { serverIssue } from "../../utils/constantes";
import putCourseVisibility from "../../models/course/put-course-visibility";

async function httpPutCourseVisibility(req: Request, res: Response) {
  const { courseId } = req.params;
  const { visibility } = req.query;

  try {
    const resposne = await putCourseVisibility(
      +courseId,
      visibility! as string
    );
    return res.status(201).json({
      success: true,
      message: "La visibilité du cours a été mise à jour",
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : serverIssue,
    });
  }
}

export default httpPutCourseVisibility;
