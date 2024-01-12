import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putReorderCourses from "../../models/course/put-reorder-courses";

export default async function httpPutReorderCourses(
  req: Request,
  res: Response
) {
  try {
    const { moduleId } = req.params;
    const coursesId = req.body;

    console.log(req.body);

    const response = await putReorderCourses(+moduleId, coursesId);
    return res.status(200).json({
      success: true,
      message: "L'ordre des cours a bien été modifié.",
      response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
