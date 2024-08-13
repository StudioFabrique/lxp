import { Request, Response, NextFunction } from "express";
import deleteCourseFromModule from "../../models/course/delete-course-from-module";

export async function httpDeleteCourseFromModule(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log("hello detach course");
    const { courseId } = req.params;
    await deleteCourseFromModule(+courseId);
    const result = {
      statusCode: 200,
      data: { message: "All good bro" },
    };
    next(result);
  } catch (error: any) {
    console.log(error.message);
    const err = {
      statusCode: error.statusCode ?? 500,
      message: error.message,
    };
    next(err);
  }
}
