import { Request, Response } from "express";

import { serverIssue } from "../../utils/constantes";
import postCourse from "../../models/course/post-course";
import { customEscape } from "../../helpers/custom-escape";

async function httpPostCourse(req: Request, res: Response) {
  let course = req.body;

  course = {
    title: customEscape(course.title),
    moduleId: +course.moduleId,
  };

  try {
    const response = await postCourse(course);
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
