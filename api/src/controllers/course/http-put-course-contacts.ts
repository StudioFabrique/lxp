import { type Request, type Response } from "express";
import putCourseContacts from "../../models/course/put-course-contacts.ts";

async function httpPutCourseContacts(req: Request, res: Response) {

  const { courseId } = req.params;
  const contacts = req.body;


  try {
    const response = await putCourseContacts(+courseId, contacts);
    return res.status(201).json({
      success: true,
      message: "Les contacts du cours ont été mis à jour",
      data: response,
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.message,
    });
  }
}

export default httpPutCourseContacts;
