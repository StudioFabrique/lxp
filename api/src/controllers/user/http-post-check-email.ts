import { type Request, type Response, type NextFunction } from "express";
import postCheckEmail from "../../models/user/post-check-email.ts";

export default async function httpPostCheckEmail(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;
    await postCheckEmail(email);
    const result = {
      statusCode: 200,
      data: { success: true, message: "Le compte utilisateur existe !" },
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
