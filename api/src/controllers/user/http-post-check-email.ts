import { Request, Response, NextFunction } from "express";
import postCheckEmail from "../../models/user/post-check-email";

export default async function httpPostCheckEmail(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body;
    console.log({ email });
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
