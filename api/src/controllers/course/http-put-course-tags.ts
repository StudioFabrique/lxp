import { type Request, type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import putCourseTags from "../../models/course/put-course-tags.ts";

async function httpPutCourseTags(req: Request, res: Response) {

  const { courseId } = req.params;
  const tags = req.body;


  try {
    const response = await putCourseTags(+courseId, tags);
    return res.status(201).json({
      success: true,
      message: "Les tags du cours ont été mis à jour",
      data: response,
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode === 404 ? error.message : error.message,
    });
  }
}

export default httpPutCourseTags;
