import { type Request, type Response, type NextFunction } from "express";
import getCoursesFromModule from "../../models/course/get-courses-from-module.ts";

export default async function httpGetCoursesFromModule(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { moduleId } = req.params;
  try {
    const response = await getCoursesFromModule(+moduleId);
    const result = {
      statusCode: 200,
      data: response,
    };
    next(result);
  } catch (error: any) {
    const err = {
      statusCode: error.statusCode ?? 500,
      message: error.message,
    };
    next(err);
  }
}
