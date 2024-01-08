import { Request, Response } from "express";

import { serverIssue } from "../../utils/constantes";
import putCourseVirtualClass from "../../models/course/put-course-virtual-class";

async function httpPutCourseVirtualClass(req: Request, res: Response) {
  const { courseId } = req.params;
  const virtualClass = req.body.virtualClass;

  try {
    const resposne = await putCourseVirtualClass(+courseId, virtualClass);
    return res.status(201).json({
      success: true,
      message: "Le lien vers la classe virtuelle a été mis à jour",
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : serverIssue,
    });
  }
}

export default httpPutCourseVirtualClass;
