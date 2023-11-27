import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putReleaseCourses from "../../models/module/put-release-courses";

export default async function httpPutReleaseCourses(
  req: Request,
  res: Response
) {
  try {
    const coursesIds = req.body;
    console.log({ coursesIds });

    await putReleaseCourses(coursesIds);
    return res
      .status(200)
      .json({
        success: true,
        message: "Les cours ont été dissociés du module",
      });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
