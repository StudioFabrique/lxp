import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putCourseInformations from "../../models/course/put-course-informations";

async function httpPutCourseInformations(req: Request, res: Response) {
  const course = req.body;

  try {
    const response = await putCourseInformations(course);

    return res.status(201).json({
      message: "Le cours a été mis à jour",
      success: true,
      data: response,
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode === 404 ? error.message : error.message,
    });
  }
}

export default httpPutCourseInformations;
