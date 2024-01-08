import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putCourseTags from "../../models/course/put-course-tags";
import putCourseContacts from "../../models/course/put-course-contacts";

async function httpPutCourseContacts(req: Request, res: Response) {
  console.log("coucou controller");

  const { courseId } = req.params;
  const contacts = req.body;

  console.log(req.body);

  try {
    const response = await putCourseContacts(+courseId, contacts);
    return res.status(201).json({
      success: true,
      message: "Les contacts du cours ont été mis à jour",
      data: response,
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode === 404 ? error.message : error.message,
    });
  }
}

export default httpPutCourseContacts;
