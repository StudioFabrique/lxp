import { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/db";

export async function deleteCourseFromModule(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    //throw { statusCode: 404, message: "Le cours n'existe pas" };
    const result = {
      statusCode: 200,
      data: { message: "All good bro" },
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
