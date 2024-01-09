import { Request, Response } from "express";

import { serverIssue } from "../../utils/constantes";
import postCourse from "../../models/course/post-course";
import { customEscape } from "../../helpers/custom-escape";
import CustomRequest from "../../utils/interfaces/express/custom-request";

async function httpPostCourse(req: CustomRequest, res: Response) {
  let course = req.body;

  const userId = req.auth?.userId;

  course = {
    title: customEscape(course.title),
    moduleId: +course.moduleId,
  };

  try {
    const response = await postCourse(userId!, course);
    return res
      .status(201)
      .json({ message: "Cours créé avec succès", course: response });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode === 500 ? serverIssue : error.message,
    });
  }
}

export default httpPostCourse;
